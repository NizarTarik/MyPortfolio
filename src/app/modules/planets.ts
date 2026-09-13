
export type TechnologyType =
  | 'frontend'
  | 'backend'
  | 'db'
  | 'devops'
  | 'automation'
  | 'log';

export interface Planet {
  name: string;

  /*
   * MUST BE AN ARRAY
   */
  type: TechnologyType[];

  color: string;
  image: string;

  orbitRadiusX: number;
  orbitRadiusY: number;

  size: number;
  speed: number;
  angle: number;

  description: string;
  icon: string;

  x?: number;
  y?: number;
}

export const TECHNOLOGY_PLANETS: Planet[] = [

  /* FRONTEND */

  {
    name: 'Angular',
    type: ['frontend'],
    color: '#dd0031',
    image: 'assets/img/tech/angular.png',
    orbitRadiusX: 80,
    orbitRadiusY: 52,
    size: 27,
    speed: 0.011,
    angle: 0.2,
    description:
      'Used Angular to build and maintain modern web applications in professional projects.',
    icon: 'A',
  },

  {
    name: 'TypeScript',
    type: ['frontend'],
    color: '#3178c6',
    image: 'assets/img/tech/typescript.png',
    orbitRadiusX: 125,
    orbitRadiusY: 82,
    size: 23,
    speed: 0.008,
    angle: 1.4,
    description:
      'Used TypeScript extensively for developing structured and maintainable Angular applications.',
    icon: 'TS',
  },

  {
    name: 'HTML',
    type: ['frontend'],
    color: '#e34f26',
    image: 'assets/img/tech/html.png',
    orbitRadiusX: 105,
    orbitRadiusY: 68,
    size: 22,
    speed: 0.0095,
    angle: 2.8,
    description:
      'Learned during vocational training and applied it across personal and web development projects.',
    icon: 'HTML',
  },

  {
    name: 'CSS',
    type: ['frontend'],
    color: '#1572b6',
    image: 'assets/img/tech/css.png',
    orbitRadiusX: 145,
    orbitRadiusY: 95,
    size: 22,
    speed: 0.0088,
    angle: 4.1,
    description:
      'Used to create responsive layouts, interfaces, and custom designs for web applications.',
    icon: 'CSS',
  },

  {
    name: 'JavaScript',
    type: ['frontend'],
    color: '#f7df1e',
    image: 'assets/img/tech/javascript.png',
    orbitRadiusX: 185,
    orbitRadiusY: 122,
    size: 24,
    speed: 0.0075,
    angle: 5.7,
    description:
      'Learned during vocational training and used to build interactive web applications and projects.',
    icon: 'JS',
  },

  {
    name: 'Bootstrap',
    type: ['frontend'],
    color: '#7952b3',
    image: 'assets/img/tech/bootstrap.png',
    orbitRadiusX: 225,
    orbitRadiusY: 148,
    size: 22,
    speed: 0.0068,
    angle: 1.1,
    description:
      'Used for building responsive interfaces and accelerating frontend development.',
    icon: 'BS',
  },


  /* BACKEND */

  {
    name: 'Java',
    type: ['backend'],
    color: '#f89820',
    image: 'assets/img/tech/java.png',
    orbitRadiusX: 175,
    orbitRadiusY: 115,
    size: 29,
    speed: 0.0065,
    angle: 2.5,
    description:
      'Used Java to develop backend applications and business logic in professional projects.',
    icon: 'J',
  },

  {
    name: 'Spring Boot',
    type: ['backend'],
    color: '#6db33f',
    image: 'assets/img/tech/springboot.png',
    orbitRadiusX: 225,
    orbitRadiusY: 148,
    size: 24,
    speed: 0.005,
    angle: 3.7,
    description:
      'Used Spring Boot to build REST APIs, backend services, and business applications.',
    icon: 'SB',
  },

  {
    name: 'PHP',
    type: ['backend'],
    color: '#777bb4',
    image: 'assets/img/tech/php.png',
    orbitRadiusX: 275,
    orbitRadiusY: 180,
    size: 25,
    speed: 0.0036,
    angle: 5.4,
    description:
      'Learned PHP during vocational training and applied it in personal web development projects.',
    icon: 'PHP',
  },

  {
    name: 'Laravel',
    type: ['backend'],
    color: '#ff2d20',
    image: 'assets/img/tech/laravel.png',
    orbitRadiusX: 325,
    orbitRadiusY: 212,
    size: 25,
    speed: 0.0032,
    angle: 0.8,
    description:
      'Learned Laravel during vocational training and used it to develop web applications.',
    icon: 'L',
  },

  {
    name: 'Symfony',
    type: ['backend'],
    color: '#000000',
    image: 'assets/img/tech/symfony.png',
    orbitRadiusX: 375,
    orbitRadiusY: 245,
    size: 24,
    speed: 0.0029,
    angle: 2.1,
    description:
      'Learned Symfony and applied it to real-world projects during a three-month internship.',
    icon: 'S',
  },


  /* DATABASE */

  {
    name: 'SQL',
    type: ['db'],
    color: '#336791',
    image: 'assets/img/tech/mysql.png',
    orbitRadiusX: 425,
    orbitRadiusY: 278,
    size: 23,
    speed: 0.0026,
    angle: 3.5,
    description:
      'Learned SQL during vocational training and used it to manage and query application data.',
    icon: 'SQL',
  },

  {
    name: 'PostgreSQL',
    type: ['db'],
    color: '#336791',
    image: 'assets/img/tech/postgresql.png',
    orbitRadiusX: 475,
    orbitRadiusY: 310,
    size: 26,
    speed: 0.0023,
    angle: 4.8,
    description:
      'Used PostgreSQL for storing, managing, and querying data in backend applications.',
    icon: 'PG',
  },


  /* DEVOPS */

  {
    name: 'Git',
    type: ['devops'],
    color: '#f05032',
    image: 'assets/img/tech/git.png',
    orbitRadiusX: 525,
    orbitRadiusY: 342,
    size: 25,
    speed: 0.0021,
    angle: 0.6,
    description:
      'Used Git for version control, source code management, and collaborative development.',
    icon: 'G',
  },

  {
    name: 'Docker',
    type: ['devops'],
    color: '#2496ed',
    image: 'assets/img/tech/docker.png',
    orbitRadiusX: 575,
    orbitRadiusY: 375,
    size: 26,
    speed: 0.0019,
    angle: 2.4,
    description:
      'Used Docker to containerize applications and simplify development environments.',
    icon: 'D',
  },


  /* AUTOMATION */

  {
    name: 'n8n',
    type: ['automation'],
    color: '#ea4b71',
    image: 'assets/img/tech/n8n.png',
    orbitRadiusX: 675,
    orbitRadiusY: 441,
    size: 25,
    speed: 0.0015,
    angle: 1.5,
    description:
      'Used n8n to automate workflows and connect applications, APIs, and business processes.',
    icon: 'n8n',
  },


  /* LOGGING & MONITORING */

  {
    name: 'Elasticsearch',
    type: ['log'],
    color: '#00bfb3',
    image: 'assets/img/tech/elasticsearch.png',
    orbitRadiusX: 725,
    orbitRadiusY: 474,
    size: 26,
    speed: 0.0013,
    angle: 3.1,
    description:
      'Used Elasticsearch for storing, searching, and analyzing application logs and data.',
    icon: 'ES',
  },

  {
    name: 'Kibana',
    type: ['log'],
    color: '#f04e98',
    image: 'assets/img/tech/kibana.png',
    orbitRadiusX: 775,
    orbitRadiusY: 507,
    size: 25,
    speed: 0.0011,
    angle: 5.0,
    description:
      'Used Kibana to visualize, monitor, and analyze application logs and Elasticsearch data.',
    icon: 'K',
  },

];
