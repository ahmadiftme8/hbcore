import {
  FirebaseAuthCredentialEntity,
  FirebaseAuthCredentialRepository,
  UserEntity,
  UserProfileRepository,
  UserRepository,
} from '@hbcore/db';
import { AuthProvider, type User, type UserInfo } from '@hbcore/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly firebaseCredentialRepository: FirebaseAuthCredentialRepository,
  ) {}

  /**
   * Get user with profile information
   */
  private async getUserWithProfile(user: UserEntity): Promise<User & UserInfo> {
    const profile = await this.userProfileRepository.findByUserId(user.id);

    return {
      id: user.id,
      email: profile?.email ?? null,
      phone: profile?.phone ?? null,
      name: profile?.name ?? null,
      firstname: profile?.firstname ?? null,
      lastname: profile?.lastname ?? null,
      photoUrl: profile?.photoUrl ?? null,
    };
  }

  /**
   * Find a user by ID
   */
  async findById(id: number): Promise<(User & UserInfo) | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return this.getUserWithProfile(user);
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<(User & UserInfo) | null> {
    const profile = await this.userProfileRepository.findByEmail(email);

    if (!profile || !profile.user) {
      return null;
    }

    return this.getUserWithProfile(profile.user);
  }

  /**
   * Find a user by phone
   */
  async findByPhone(phone: string): Promise<(User & UserInfo) | null> {
    const profile = await this.userProfileRepository.findByPhone(phone);

    if (!profile || !profile.user) {
      return null;
    }

    return this.getUserWithProfile(profile.user);
  }

  /**
   * Find a user by Firebase UID
   */
  async findByFirebaseUid(firebaseUid: string): Promise<(User & UserInfo) | null> {
    const credential = await this.firebaseCredentialRepository.findByFirebaseUid(firebaseUid);

    if (!credential) {
      return null;
    }

    const user = await this.userRepository.findById(credential.userId);

    if (!user) {
      return null;
    }

    return this.getUserWithProfile(user);
  }

  /**
   * Create a new user
   */
  async create(userData: Partial<User & UserInfo>): Promise<User & UserInfo> {
    const { email, phone, name, firstname, lastname, photoUrl, ...rest } = userData;
    const savedUser = await this.userRepository.create(rest);

    // Create profile if profile data is provided
    if (
      email !== undefined ||
      phone !== undefined ||
      name !== undefined ||
      firstname !== undefined ||
      lastname !== undefined ||
      photoUrl !== undefined
    ) {
      await this.userProfileRepository.create({
        userId: savedUser.id,
        email: email ?? null,
        phone: phone ?? null,
        name: name ?? null,
        firstname: firstname ?? null,
        lastname: lastname ?? null,
        photoUrl: photoUrl ?? null,
      });
    }

    return this.getUserWithProfile(savedUser);
  }

  /**
   * Update a user
   */
  async update(id: number, userData: Partial<User & UserInfo>): Promise<User & UserInfo> {
    const { email, phone, name, firstname, lastname, photoUrl, ...rest } = userData;

    // Update user entity if there are non-profile fields
    if (Object.keys(rest).length > 0) {
      await this.userRepository.update(id, rest);
    }

    // Update or create profile
    if (
      email !== undefined ||
      phone !== undefined ||
      name !== undefined ||
      firstname !== undefined ||
      lastname !== undefined ||
      photoUrl !== undefined
    ) {
      const existingProfile = await this.userProfileRepository.findByUserId(id);

      if (existingProfile) {
        existingProfile.email = email ?? existingProfile.email ?? null;
        existingProfile.phone = phone ?? existingProfile.phone ?? null;
        existingProfile.name = name ?? existingProfile.name ?? null;
        existingProfile.firstname = firstname ?? existingProfile.firstname ?? null;
        existingProfile.lastname = lastname ?? existingProfile.lastname ?? null;
        existingProfile.photoUrl = photoUrl ?? existingProfile.photoUrl ?? null;
        await this.userProfileRepository.save(existingProfile);
      } else {
        await this.userProfileRepository.create({
          userId: id,
          email: email ?? null,
          phone: phone ?? null,
          name: name ?? null,
          firstname: firstname ?? null,
          lastname: lastname ?? null,
          photoUrl: photoUrl ?? null,
        });
      }
    }

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`User with id ${id} not found`);
    }
    return updated;
  }

  /**
   * Create or update Firebase authentication credential for a user
   */
  async upsertFirebaseCredential(userId: number, firebaseUid: string): Promise<FirebaseAuthCredentialEntity> {
    const existing = await this.firebaseCredentialRepository.findByUserId(userId);

    if (existing) {
      existing.firebaseUid = firebaseUid;
      return this.firebaseCredentialRepository.save(existing);
    }

    return this.firebaseCredentialRepository.create({
      userId,
      provider: AuthProvider.FIREBASE,
      firebaseUid,
    });
  }

  /**
   * Find or create a user by Firebase UID
   * If user exists with the Firebase credential, return it
   * Otherwise, create a new user and credential
   */
  async findOrCreateByFirebaseUid(firebaseUid: string, userData: Partial<User & UserInfo>): Promise<User & UserInfo> {
    // First, try to find by Firebase credential
    const existing = await this.findByFirebaseUid(firebaseUid);
    if (existing) {
      // Update user data if provided
      if (Object.keys(userData).length > 0) {
        return this.update(existing.id, userData);
      }
      return existing;
    }

    // Create new user
    const user = await this.create(userData);

    // Create Firebase credential
    await this.upsertFirebaseCredential(user.id, firebaseUid);

    // Return user with profile
    const result = await this.findById(user.id);
    if (!result) {
      throw new Error('Failed to retrieve created user');
    }
    return result;
  }
}
