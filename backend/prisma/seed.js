const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const LOREM =
  'Lorem ipsum dolor sit amet consectetur. Massa nec vulputate amet enim turpis elit odio fusce. ' +
  'Nunc cursus aliquet arcu vitae dolor ac rutrum pulvinar orci. Tristique nulla sed at nisl justo ' +
  'ipsum accumsan sed a. Enim amet varius ligula egestas. Integer vestibulum elementum non fermentum.';

function richtextBlock(id, order, html) {
  return { id, type: 'richtext', order, data: { html } };
}

function headingBlock(id, order, text, level = 2) {
  return { id, type: 'heading', order, data: { text, level } };
}

async function main() {
  console.log('Seeding database...');

  // ---- Default admin ----
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@renewcred.local' },
    update: {},
    create: {
      name: 'RenewCred Admin',
      email: 'admin@renewcred.local',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Default admin ready:', admin.email);

  // ---- Categories (drives the Standards listing on the public site) ----
  const categoriesData = [
    { name: 'EV', slug: 'ev', icon: '🔌', order: 1 },
    { name: 'Biochar', slug: 'biochar', icon: '🌱', order: 2 },
    { name: 'Methane', slug: 'methane', icon: '☁️', order: 3 },
    { name: 'Renewable Energy', slug: 'renewable-energy', icon: '🌬️', order: 4 },
  ];

  const categories = {};
  for (const c of categoriesData) {
    categories[c.slug] = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
  console.log('Categories ready:', Object.keys(categories).join(', '));

  // ---- Settings ----
  await prisma.setting.upsert({
    where: { key: 'site' },
    update: {},
    create: {
      key: 'site',
      value: {
        siteName: 'RenewCred',
        tagline: 'There is no time to save the planet',
        email: 'yp@renewcred.com',
        address: 'Indiranagar, Bengaluru, Karnataka, INDIA',
        cin: 'XXXXXXXXX',
        social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
      },
    },
  });

  // ---- Home page ----
  await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Home',
      slug: 'home',
      pageType: 'page',
      status: 'PUBLISHED',
      authorId: admin.id,
      metaTitle: 'RenewCred — Carbon Credits Standard and Registry',
      metaDescription: 'RenewCred is a carbon credits standard and registry.',
      blocks: [
        headingBlock('b1', 0, 'RenewCred Standards', 1),
        richtextBlock('b2', 1, `<p>${LOREM.slice(0, 140)}</p>`),
      ],
    },
  });

  // ---- One "standard" page per category, mirroring the provided design ----
  for (const c of categoriesData) {
    await prisma.page.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        title: c.name,
        slug: c.slug,
        pageType: 'standard',
        status: 'PUBLISHED',
        authorId: admin.id,
        categoryId: categories[c.slug].id,
        version: 'v1.0.0',
        publicationDate: new Date('2025-07-12'),
        consultationStart: new Date('2025-05-12'),
        consultationEnd: new Date('2025-07-12'),
        excerpt: LOREM.slice(0, 120),
        metaTitle: `${c.name} Standard — RenewCred`,
        metaDescription: LOREM.slice(0, 150),
        blocks: [
          headingBlock('h1', 0, '1.0 Introduction', 2),
          richtextBlock('p1', 1, `<p>${LOREM}</p>`),
          headingBlock('h2', 2, '2.0 Future Versions', 2),
          richtextBlock('p2', 3, `<p>${LOREM}</p>`),
          {
            id: 'l1',
            type: 'list',
            order: 4,
            data: {
              style: 'unordered',
              items: [
                '2.1 Future Versions',
                '2.1.1 Future Versions',
                '2.1.2 Future Versions',
                '2.2 Future Versions',
              ],
            },
          },
          headingBlock('h3', 5, '3.0 Future Versions', 2),
          richtextBlock('p3', 6, `<p>${LOREM}</p>`),
          {
            id: 't1',
            type: 'table',
            order: 7,
            data: {
              headers: ['Version', 'Status', 'Date'],
              rows: [
                ['v1.0.0', 'Certified', '12 Jul 2025'],
                ['v0.9.0', 'Public Consultation', '12 May 2025'],
              ],
            },
          },
          {
            id: 'eq1',
            type: 'equation',
            order: 8,
            data: {
              equation: 'E_{saved} = \\sum_{i=1}^{n} (B_i - P_i) \\times EF_i',
              displayMode: true,
              caption: 'Emissions reduction calculation',
            },
          },
        ],
      },
    });
  }
  console.log('Standard pages ready.');

  // ---- Documentation sample page ----
  await prisma.page.upsert({
    where: { slug: 'impartiality-policy' },
    update: {},
    create: {
      title: 'Impartiality Policy',
      slug: 'impartiality-policy',
      pageType: 'doc',
      status: 'PUBLISHED',
      authorId: admin.id,
      version: 'v1.0.0',
      publicationDate: new Date('2025-07-12'),
      blocks: [
        headingBlock('d1', 0, 'Impartiality Policy', 1),
        richtextBlock('d2', 1, `<p>${LOREM}</p>`),
        {
          id: 'd3',
          type: 'callout',
          order: 2,
          data: { tone: 'info', text: 'This policy is reviewed annually by the RenewCred standards committee.' },
        },
      ],
    },
  });

  console.log('Seed complete.');
  console.log('----------------------------------------');
  console.log('Default admin login:');
  console.log('  email:    admin@renewcred.local');
  console.log('  password: Admin@123');
  console.log('----------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
