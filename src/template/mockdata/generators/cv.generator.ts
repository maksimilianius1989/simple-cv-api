import { fakerUK as faker } from '@faker-js/faker';
import { DOMAINS, AVATARS } from '../constants/domain.constant';

export interface Portfolio {
  name: string;
  url: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
}

export interface Contacts {
  phone: string;
  email: string;
  location: string;
  linkedin: string;
}

export interface CvContent {
  name: string;
  position: string;
  employmentType: string;
  salary: string;
  contacts: Contacts;
  portfolios: Portfolio[];
  summary: string;
  skills: string[];
  experience: Experience[];
}

export interface MockCvObject {
  content: CvContent;
  avatar: string;
  qr: string;
}

export function generateMockCvContent(): MockCvObject {
  // 1. Визначаємо стать ('female' | 'male')
  const sex = faker.person.sexType();

  // 2. Отримуємо список галузей без компіляційних помилок
  const domainKeys = Object.keys(DOMAINS);
  const selectedDomainKey = faker.helpers.arrayElement(domainKeys);
  const selectedDomain = DOMAINS[selectedDomainKey];

  // 3. Генеруємо персональні дані відповідно до статі
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);
  const fullName = `${firstName} ${lastName}`;
  const username = faker.internet
    .username({ firstName, lastName })
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  // 4. Формуємо відповідні портфоліо
  const portfolios: Portfolio[] = [
    {
      name: selectedDomainKey === 'DESIGN' ? 'Behance' : 'GitHub',
      url:
        selectedDomainKey === 'DESIGN'
          ? `https://www.behance.net/${username}`
          : `https://github.com/${username}`,
    },
    {
      name: 'Personal Website',
      url: `https://${username}.tech`,
    },
  ];

  // 5. Генеруємо досвід роботи
  const experienceCount = faker.number.int({ min: 1, max: 3 });
  const experience: Experience[] = [];
  let currentYear = new Date().getFullYear();

  for (let i = 0; i < experienceCount; i++) {
    const isCurrentJob = i === 0 && faker.datatype.boolean();
    const startDate = faker.date.past({
      years: 2,
      refDate: new Date(currentYear - 1, 0, 1),
    });
    const endDate = isCurrentJob
      ? null
      : faker.date.between({
          from: startDate,
          to: new Date(currentYear, 0, 1),
        });

    if (endDate) {
      currentYear = startDate.getFullYear();
    }

    experience.push({
      company: faker.company.name(),
      position: faker.helpers.arrayElement(selectedDomain.positions),
      startDate,
      endDate,
      description: faker.lorem.paragraph({ min: 2, max: 3 }),
    });
  }

  // 6. Вибираємо відповідний аватар
  const avatar = sex === 'female' ? AVATARS.female : AVATARS.male;

  return {
    content: {
      name: fullName,
      position: faker.helpers.arrayElement(selectedDomain.positions),
      employmentType: faker.helpers.arrayElement([
        'Full-time',
        'Part-time',
        'Contract',
        'Freelance',
      ]),
      salary: `$${faker.number.int({ min: 1500, max: 5500 }).toLocaleString('en-US')}`,
      contacts: {
        phone: faker.phone.number({ style: 'international' }),
        email: faker.internet.email({ firstName, lastName }),
        location: `${faker.location.city()}, Україна`,
        linkedin: `https://www.linkedin.com/in/${username}`,
      },
      portfolios,
      summary: faker.lorem.paragraph({ min: 2, max: 3 }),
      skills: faker.helpers.arrayElements(selectedDomain.skills, {
        min: 4,
        max: 7,
      }),
      experience,
    },
    avatar,
    qr: String(process.env.APP_DOMAIN || 'https://simplecv.life'),
  };
}
