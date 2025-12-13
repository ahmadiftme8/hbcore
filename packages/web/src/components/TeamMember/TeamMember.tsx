import Image from 'next/image';

interface TeamMemberProps {
  name: string;
  role: string;
  education: string;
  bio: string;
  imagePath: string;
}

export function TeamMember({ name, role, education, bio, imagePath }: TeamMemberProps) {
  return (
    <div className="team-member">
      <div className="team-member__image-wrapper">
        <Image
          src={imagePath}
          alt={name}
          fill
          className="team-member__image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="team-member__content">
        <h3 className="team-member__name">{name}</h3>
        <p className="team-member__role">{role}</p>
        <p className="team-member__education">{education}</p>
        <p className="team-member__bio">{bio}</p>
      </div>
    </div>
  );
}
