import Image from 'next/image';
import { TeamMember } from '@/components/TeamMember/TeamMember';
import { getServerTranslations } from '@/i18n/server';
import '@/components/TeamMember/TeamMember.css';

export default async function AboutPage() {
  const translations = await getServerTranslations();

  const teamMembers = [
    {
      name: translations.about.team.members.amirhosseinMoshki.name,
      role: translations.about.team.members.amirhosseinMoshki.role,
      education: translations.about.team.members.amirhosseinMoshki.education,
      bio: translations.about.team.members.amirhosseinMoshki.bio,
      imagePath: '/images/personally/AmirhosseinMoshki.JPG',
    },
    {
      name: translations.about.team.members.alirezaJafartash.name,
      role: translations.about.team.members.alirezaJafartash.role,
      education: translations.about.team.members.alirezaJafartash.education,
      bio: translations.about.team.members.alirezaJafartash.bio,
      imagePath: '/images/personally/AlirezaJafartash.JPG',
    },
    {
      name: translations.about.team.members.hadiEsfandiarpour.name,
      role: translations.about.team.members.hadiEsfandiarpour.role,
      education: translations.about.team.members.hadiEsfandiarpour.education,
      bio: translations.about.team.members.hadiEsfandiarpour.bio,
      imagePath: '/images/personally/HadiEsfandiarpour.JPG',
    },
    {
      name: translations.about.team.members.melikaEslami.name,
      role: translations.about.team.members.melikaEslami.role,
      education: translations.about.team.members.melikaEslami.education,
      bio: translations.about.team.members.melikaEslami.bio,
      imagePath: '/images/personally/MelikaEslami.JPG',
    },
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Header Section */}
      <section className="w-full py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center">{translations.about.title}</h1>
        </div>
      </section>

      {/* Description Section */}
      <section className="w-full py-12 px-8 bg-brand-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image on Left */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden [dir:ltr]">
              <Image
                src="/images/hero/hero_8.jpg"
                alt={translations.about.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Text on Right */}
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-muted-foreground">{translations.about.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{translations.about.team.title}</h2>
            <p className="text-lg text-muted-foreground">{translations.about.team.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {teamMembers.map((member) => (
              <TeamMember key={member.name} {...member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
