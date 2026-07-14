export const ollamaDraftContentSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    position: {
      type: 'string',
    },
    contacts: {
      type: 'object',
      properties: {
        phone: { type: 'string' },
        email: { type: 'string' },
        location: { type: 'string' },
        linkedin: { type: 'string' },
      },
      required: [],
    },
    employmentType: {
      type: 'string',
    },
    repositories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          url: { type: 'string' },
        },
        required: ['name', 'url'],
      },
    },
    summary: {
      type: 'string',
    },
    skills: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    salary: {
      type: 'string',
    },
    coverLetter: {
      type: 'string',
    },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          company: { type: 'string' },
          position: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          description: { type: 'string' },
        },
        required: [
          'company',
          'position',
          'startDate',
          'endDate',
          'description',
        ],
      },
    },
  },
  required: ['name', 'position', 'coverLetter', 'experience'],
};
