import { Line, Logo, Row, Text } from '@once-ui-system/core';
import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from '@/types';

const person: Person = {
  firstName: 'Selene',
  lastName: 'Yu',
  name: `Selene Yu`,
  role: 'طراح مهندس',
  avatar: '/images/avatar.jpg',
  email: 'example@gmail.com',
  location: 'Asia/Jakarta', // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ['English', 'Bahasa'], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>اشتراک در خبرنامه {person.firstName}</>,
  description: <>خبرنامه هفتگی من درباره خلاقیت و مهندسی</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: 'GitHub',
    icon: 'github',
    link: 'https://github.com/once-ui-system',
  },
  {
    name: 'LinkedIn',
    icon: 'linkedin',
    link: 'https://www.linkedin.com/company/once-ui/',
  },
  {
    name: 'Threads',
    icon: 'threads',
    link: 'https://www.threads.com/@once_ui',
  },
  {
    name: 'Email',
    icon: 'email',
    link: `mailto:${person.email}`,
  },
];

const home: Home = {
  path: '/',
  image: '/images/og/home.jpg',
  label: 'خانه',
  title: `نمونه کار ${person.name}`,
  description: `وب‌سایت نمونه کار که کارهای من به عنوان ${person.role} را نمایش می‌دهد`,
  headline: <>ساختن پل بین طراحی و کد</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Once UI</strong> <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          کارهای برجسته
        </Text>
      </Row>
    ),
    href: '/work/building-once-ui-a-customizable-design-system',
  },
  subline: (
    <>
      من سلین هستم، یک طراح مهندس در{' '}
      <Logo
        dark
        icon="/trademarks/wordmark-dark.svg"
        style={{ display: 'inline-flex', top: '0.25em', marginLeft: '-0.25em' }}
      />
      ، جایی که تجربیات کاربری
      <br /> بصری می‌سازم. بعد از ساعات کاری، پروژه‌های خودم را می‌سازم.
    </>
  ),
};

const about: About = {
  path: '/about',
  label: 'درباره',
  title: `درباره – ${person.name}`,
  description: `با ${person.name}، ${person.role} از ${person.location} آشنا شوید`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: 'https://cal.com',
  },
  intro: {
    display: true,
    title: 'معرفی',
    description: (
      <>
        سلین یک طراح مهندس ساکن جاکارتا است که علاقه‌مند به تبدیل چالش‌های پیچیده به راه‌حل‌های طراحی ساده و ظریف است. کار
        او شامل رابط‌های دیجیتال، تجربیات تعاملی و همگرایی طراحی و فناوری می‌شود.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: 'سوابق کاری',
    experiences: [
      {
        company: 'FLY',
        timeframe: '2022 - اکنون',
        role: 'طراح مهندس ارشد',
        achievements: [
          <>
            بازطراحی UI/UX برای پلتفرم FLY که منجر به افزایش 20 درصدی تعامل کاربران و 30 درصد سریع‌تر شدن زمان بارگذاری
            شد.
          </>,
          <>پیشگامی در ادغام ابزارهای هوش مصنوعی در گردش کار طراحی، که به طراحان امکان تکرار 50 درصد سریع‌تر را داد.</>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: '/images/projects/project-01/cover-01.jpg',
            alt: 'Once UI Project',
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: 'Creativ3',
        timeframe: '2018 - 2022',
        role: 'طراح ارشد',
        achievements: [
          <>توسعه یک سیستم طراحی که برند را در چندین پلتفرم یکپارچه کرد و سازگاری طراحی را 40 درصد بهبود بخشید.</>,
          <>رهبری یک تیم چند عملکردی برای راه‌اندازی یک خط تولید جدید، که به افزایش 15 درصدی درآمد کل شرکت کمک کرد.</>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: 'تحصیلات',
    institutions: [
      {
        name: 'دانشگاه جاکارتا',
        description: <>تحصیل در رشته مهندسی نرم‌افزار.</>,
      },
      {
        name: 'Build the Future',
        description: <>تحصیل در بازاریابی آنلاین و برندسازی شخصی.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: 'مهارت‌های فنی',
    skills: [
      {
        title: 'Figma',
        description: <>قادر به ساخت نمونه اولیه در Figma با Once UI با سرعت غیرعادی.</>,
        tags: [
          {
            name: 'Figma',
            icon: 'figma',
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: '/images/projects/project-01/cover-02.jpg',
            alt: 'Project image',
            width: 16,
            height: 9,
          },
          {
            src: '/images/projects/project-01/cover-03.jpg',
            alt: 'Project image',
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: 'Next.js',
        description: <>ساخت اپلیکیشن‌های نسل بعدی با Next.js + Once UI + Supabase.</>,
        tags: [
          {
            name: 'JavaScript',
            icon: 'javascript',
          },
          {
            name: 'Next.js',
            icon: 'nextjs',
          },
          {
            name: 'Supabase',
            icon: 'supabase',
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: '/images/projects/project-01/cover-04.jpg',
            alt: 'Project image',
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog: Blog = {
  path: '/blog',
  label: 'بلاگ',
  title: 'نوشتن درباره طراحی و فناوری...',
  description: `بخوانید ${person.name} اخیراً چه کرده است`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: '/work',
  label: 'کار',
  title: `پروژه‌ها – ${person.name}`,
  description: `پروژه‌های طراحی و توسعه توسط ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: '/gallery',
  label: 'گالری',
  title: `گالری عکس – ${person.name}`,
  description: `مجموعه عکس توسط ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: '/images/gallery/horizontal-1.jpg',
      alt: 'image',
      orientation: 'horizontal',
    },
    {
      src: '/images/gallery/vertical-4.jpg',
      alt: 'image',
      orientation: 'vertical',
    },
    {
      src: '/images/gallery/horizontal-3.jpg',
      alt: 'image',
      orientation: 'horizontal',
    },
    {
      src: '/images/gallery/vertical-1.jpg',
      alt: 'image',
      orientation: 'vertical',
    },
    {
      src: '/images/gallery/vertical-2.jpg',
      alt: 'image',
      orientation: 'vertical',
    },
    {
      src: '/images/gallery/horizontal-2.jpg',
      alt: 'image',
      orientation: 'horizontal',
    },
    {
      src: '/images/gallery/horizontal-4.jpg',
      alt: 'image',
      orientation: 'horizontal',
    },
    {
      src: '/images/gallery/vertical-3.jpg',
      alt: 'image',
      orientation: 'vertical',
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
