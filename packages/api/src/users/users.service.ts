import {
  FirebaseAuthCredentialEntity,
  FirebaseAuthCredentialRepository,
  PhoneAuthCredentialRepository,
  UserEntity,
  UserProfileRepository,
  UserRepository,
} from '@hbcore/db';
import {
  AuthProvider,
  EmailSchema,
  FirebaseUidSchema,
  PhoneSchema,
  type User,
  type UserId,
  type UserInfo,
} from '@hbcore/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly firebaseCredentialRepository: FirebaseAuthCredentialRepository,
    private readonly phoneCredentialRepository: PhoneAuthCredentialRepository,
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
    };
  }

  /**
   * Find a user by ID
   */
  async findById(id: UserId): Promise<(User & UserInfo) | null> {
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
    // Parse and validate email from external input
    const parsedEmail = EmailSchema.parse(email);
    const profile = await this.userProfileRepository.findByEmail(parsedEmail);

    if (!profile || !profile.user) {
      return null;
    }

    return this.getUserWithProfile(profile.user);
  }

  /**
   * Find a user by phone
   */
  async findByPhone(phone: string): Promise<(User & UserInfo) | null> {
    // Parse and validate phone from external input
    const parsedPhone = PhoneSchema.parse(phone);

    // Prefer phone auth credentials (source of truth for phone authentication)
    const credential = await this.phoneCredentialRepository.findByPhone(parsedPhone);
    if (credential?.user) {
      const userWithProfile = await this.getUserWithProfile(credential.user);
      // If profile doesn't have phone yet, return the credential phone for completeness
      return {
        ...userWithProfile,
        phone: userWithProfile.phone ?? parsedPhone,
      };
    }

    // Fallback to profile phone lookup (legacy / non-auth use cases)
    const profile = await this.userProfileRepository.findByPhone(parsedPhone);
    if (!profile?.user) {
      return null;
    }

    return this.getUserWithProfile(profile.user);
  }

  /**
   * Find a user by Firebase UID
   */
  async findByFirebaseUid(firebaseUid: string): Promise<(User & UserInfo) | null> {
    // Parse and validate Firebase UID from external input
    const parsedFirebaseUid = FirebaseUidSchema.parse(firebaseUid);
    const credential = await this.firebaseCredentialRepository.findByFirebaseUid(parsedFirebaseUid);

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
    const { email, phone, name, firstname, lastname, ...rest } = userData;
    const savedUser = await this.userRepository.create(rest);

    // Create profile if profile data is provided
    if (
      email !== undefined ||
      phone !== undefined ||
      name !== undefined ||
      firstname !== undefined ||
      lastname !== undefined
    ) {
      // Parse email and phone if provided (they may come from external input)
      const parsedEmail = email !== undefined && email !== null ? EmailSchema.parse(email) : null;
      const parsedPhone = phone !== undefined && phone !== null ? PhoneSchema.parse(phone) : null;

      await this.userProfileRepository.create({
        userId: savedUser.id,
        email: parsedEmail,
        phone: parsedPhone,
        name: name ?? null,
        firstname: firstname ?? null,
        lastname: lastname ?? null,
      });
    }

    return this.getUserWithProfile(savedUser);
  }

  /**
   * Update a user
   */
  async update(id: UserId, userData: Partial<User & UserInfo>): Promise<User & UserInfo> {
    const { email, phone, name, firstname, lastname, ...rest } = userData;

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
      lastname !== undefined
    ) {
      // Parse email and phone if provided (they may come from external input)
      const parsedEmail = email !== undefined && email !== null ? EmailSchema.parse(email) : null;
      const parsedPhone = phone !== undefined && phone !== null ? PhoneSchema.parse(phone) : null;

      const existingProfile = await this.userProfileRepository.findByUserId(id);

      if (existingProfile) {
        existingProfile.email = parsedEmail ?? existingProfile.email ?? null;
        existingProfile.phone = parsedPhone ?? existingProfile.phone ?? null;
        existingProfile.name = name ?? existingProfile.name ?? null;
        existingProfile.firstname = firstname ?? existingProfile.firstname ?? null;
        existingProfile.lastname = lastname ?? existingProfile.lastname ?? null;
        await this.userProfileRepository.save(existingProfile);
      } else {
        await this.userProfileRepository.create({
          userId: id,
          email: parsedEmail,
          phone: parsedPhone,
          name: name ?? null,
          firstname: firstname ?? null,
          lastname: lastname ?? null,
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
  async upsertFirebaseCredential(userId: UserId, firebaseUid: string): Promise<FirebaseAuthCredentialEntity> {
    // Parse Firebase UID from external input
    const parsedFirebaseUid = FirebaseUidSchema.parse(firebaseUid);
    const existing = await this.firebaseCredentialRepository.findByUserId(userId);

    if (existing) {
      existing.firebaseUid = parsedFirebaseUid;
      return this.firebaseCredentialRepository.save(existing);
    }

    return this.firebaseCredentialRepository.create({
      userId,
      provider: AuthProvider.FIREBASE,
      firebaseUid: parsedFirebaseUid,
    });
  }

  /**
   * Find or create a user by Firebase UID
   * If user exists with the Firebase credential, return it
   * Otherwise, create a new user and credential
   */
  async findOrCreateByFirebaseUid(firebaseUid: string, userData: Partial<User & UserInfo>): Promise<User & UserInfo> {
    // Parse Firebase UID from external input
    const parsedFirebaseUid = FirebaseUidSchema.parse(firebaseUid);
    // First, try to find by Firebase credential
    const existing = await this.findByFirebaseUid(parsedFirebaseUid);
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
    await this.upsertFirebaseCredential(user.id, parsedFirebaseUid);

    // Return user with profile
    const result = await this.findById(user.id);
    if (!result) {
      throw new Error('Failed to retrieve created user');
    }
    return result;
  }

  /**
   * Create or update phone authentication credential for a user
   */
  async upsertPhoneCredential(userId: UserId, phone: string): Promise<void> {
    // Parse phone from external input
    const parsedPhone = PhoneSchema.parse(phone);
    const existing = await this.phoneCredentialRepository.findByUserId(userId);

    if (existing) {
      existing.phone = parsedPhone;
      await this.phoneCredentialRepository.save(existing);
    } else {
      await this.phoneCredentialRepository.create({
        userId,
        provider: AuthProvider.PHONE,
        phone: parsedPhone,
      });
    }
  }

  /**
   * Find or create a user by phone number
   * If user exists with the phone credential, return it
   * Otherwise, create a new user and credential
   */
  async findOrCreateByPhone(phone: string, userData: Partial<User & UserInfo>): Promise<User & UserInfo> {
    // Parse phone from external input
    const parsedPhone = PhoneSchema.parse(phone);
    // First, try to find by phone
    const existing = await this.findByPhone(parsedPhone);
    if (existing) {
      // Update user data if provided
      if (Object.keys(userData).length > 0) {
        return this.update(existing.id, userData);
      }
      return existing;
    }

    // Create new user
    const user = await this.create({
      ...userData,
      phone: userData.phone ?? parsedPhone,
    });

    // Create phone credential
    await this.upsertPhoneCredential(user.id, parsedPhone);

    // Return user with profile
    const result = await this.findById(user.id);
    if (!result) {
      throw new Error('Failed to retrieve created user');
    }
    return result;
  }
}
