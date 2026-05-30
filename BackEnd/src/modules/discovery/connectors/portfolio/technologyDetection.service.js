import * as cheerio from "cheerio";
import axios from "axios";

export class TechnologyDetectionService {
  constructor() {
    this.technologyPatterns = {
      frontend: {
        frameworks: [
          { name: 'React', patterns: ['react', 'jsx', 'create-react-app', 'react-dom'], files: ['react.development.js', 'react.production.min.js'] },
          { name: 'Vue', patterns: ['vue', 'vue.js', 'vuex', 'vue-router'], files: ['vue.js', 'vue.min.js'] },
          { name: 'Angular', patterns: ['angular', 'ng-', 'angular.js', 'angular.min.js'], files: ['angular.js', 'angular.min.js'] },
          { name: 'Svelte', patterns: ['svelte', 'svelte.js'], files: ['svelte.js'] },
          { name: 'Next.js', patterns: ['next.js', 'nextjs', 'next.config'], files: ['_next', 'next.config.js'] },
          { name: 'Nuxt.js', patterns: ['nuxt.js', 'nuxtjs', 'nuxt.config'], files: ['nuxt.config.js'] },
          { name: 'Gatsby', patterns: ['gatsby', 'gatsby.js'], files: ['gatsby-config.js', 'gatsby-node.js'] }
        ],
        libraries: [
          { name: 'Redux', patterns: ['redux', 'react-redux', '@reduxjs'], files: ['redux.js'] },
          { name: 'MobX', patterns: ['mobx', 'react-mobx'], files: ['mobx.js'] },
          { name: 'Zustand', patterns: ['zustand'], files: [] },
          { name: 'Tailwind CSS', patterns: ['tailwindcss', '@tailwind'], files: ['tailwind.config.js'] },
          { name: 'Bootstrap', patterns: ['bootstrap'], files: ['bootstrap.css', 'bootstrap.min.css'] },
          { name: 'Material-UI', patterns: ['material-ui', '@mui'], files: [] },
          { name: 'Ant Design', patterns: ['antd', 'ant.design'], files: [] }
        ],
        tools: [
          { name: 'Webpack', patterns: ['webpack', 'webpack.config'], files: ['webpack.config.js'] },
          { name: 'Vite', patterns: ['vite', 'vite.config'], files: ['vite.config.js'] },
          { name: 'Parcel', patterns: ['parcel'], files: ['parcel.config.js'] },
          { name: 'Babel', patterns: ['babel', '@babel'], files: ['babel.config.js'] },
          { name: 'PostCSS', patterns: ['postcss'], files: ['postcss.config.js'] }
        ]
      },
      backend: {
        frameworks: [
          { name: 'Node.js', patterns: ['node.js', 'nodejs', 'express', 'koa', 'fastify'], files: ['package.json', 'server.js'] },
          { name: 'Express', patterns: ['express', 'express.js'], files: ['express.js'] },
          { name: 'Django', patterns: ['django', 'djangoproject'], files: ['settings.py', 'manage.py'] },
          { name: 'Flask', patterns: ['flask'], files: ['app.py', 'flask.py'] },
          { name: 'Rails', patterns: ['rails', 'ruby on rails'], files: ['Gemfile', 'config/routes.rb'] },
          { name: 'Spring', patterns: ['spring', 'spring boot'], files: ['pom.xml', 'application.properties'] },
          { name: 'Laravel', patterns: ['laravel'], files: ['artisan', 'composer.json'] },
          { name: 'PHP', patterns: ['php', 'wordpress', 'drupal'], files: ['index.php', 'wp-config.php'] }
        ],
        apis: [
          { name: 'REST API', patterns: ['rest', 'api', 'restful'], files: [] },
          { name: 'GraphQL', patterns: ['graphql', 'apollo', 'gql'], files: ['schema.graphql'] },
          { name: 'gRPC', patterns: ['grpc'], files: [] },
          { name: 'WebSocket', patterns: ['websocket', 'socket.io'], files: ['socket.io.js'] }
        ]
      },
      databases: [
        { name: 'MongoDB', patterns: ['mongodb', 'mongo', 'mongoose'], files: [] },
        { name: 'PostgreSQL', patterns: ['postgresql', 'postgres', 'pg'], files: [] },
        { name: 'MySQL', patterns: ['mysql'], files: [] },
        { name: 'Redis', patterns: ['redis'], files: [] },
        { name: 'Elasticsearch', patterns: ['elasticsearch', 'elastic'], files: [] },
        { name: 'Cassandra', patterns: ['cassandra'], files: [] },
        { name: 'DynamoDB', patterns: ['dynamodb'], files: [] },
        { name: 'Neo4j', patterns: ['neo4j', 'neo'], files: [] }
      ],
      cloud: {
        providers: [
          { name: 'AWS', patterns: ['aws', 'amazon', 's3', 'ec2', 'lambda'], files: [] },
          { name: 'Azure', patterns: ['azure', 'microsoft'], files: [] },
          { name: 'Google Cloud', patterns: ['gcp', 'google cloud', 'firebase'], files: [] },
          { name: 'Heroku', patterns: ['heroku'], files: [] },
          { name: 'Vercel', patterns: ['vercel'], files: [] },
          { name: 'Netlify', patterns: ['netlify'], files: [] },
          { name: 'DigitalOcean', patterns: ['digitalocean'], files: [] }
        ],
        services: [
          { name: 'EC2', patterns: ['ec2'], files: [] },
          { name: 'S3', patterns: ['s3'], files: [] },
          { name: 'Lambda', patterns: ['lambda'], files: [] },
          { name: 'CloudFront', patterns: ['cloudfront'], files: [] },
          { name: 'API Gateway', patterns: ['api gateway'], files: [] },
          { name: 'Cloud Functions', patterns: ['cloud functions'], files: [] }
        ]
      },
      devops: {
        cicd: [
          { name: 'Jenkins', patterns: ['jenkins'], files: [] },
          { name: 'GitHub Actions', patterns: ['github actions', 'github workflows'], files: ['.github/workflows'] },
          { name: 'GitLab CI', patterns: ['gitlab ci', '.gitlab-ci.yml'], files: ['.gitlab-ci.yml'] },
          { name: 'CircleCI', patterns: ['circleci'], files: ['.circleci'] },
          { name: 'Travis CI', patterns: ['travis ci', '.travis.yml'], files: ['.travis.yml'] }
        ],
        containerization: [
          { name: 'Docker', patterns: ['docker'], files: ['Dockerfile', 'docker-compose.yml'] },
          { name: 'Kubernetes', patterns: ['kubernetes', 'k8s'], files: ['k8s', 'kubernetes'] },
          { name: 'Helm', patterns: ['helm'], files: ['Chart.yaml'] },
          { name: 'Docker Compose', patterns: ['docker-compose'], files: ['docker-compose.yml'] }
        ],
        infrastructure: [
          { name: 'Terraform', patterns: ['terraform'], files: ['main.tf', 'terraform.tf'] },
          { name: 'Ansible', patterns: ['ansible'], files: ['playbook.yml', 'ansible.cfg'] },
          { name: 'Puppet', patterns: ['puppet'], files: [] },
          { name: 'Chef', patterns: ['chef'], files: [] }
        ]
      },
      ai_ml: {
        frameworks: [
          { name: 'TensorFlow', patterns: ['tensorflow', 'tf'], files: [] },
          { name: 'PyTorch', patterns: ['pytorch', 'torch'], files: [] },
          { name: 'Keras', patterns: ['keras'], files: [] },
          { name: 'Scikit-learn', patterns: ['scikit-learn', 'sklearn'], files: [] },
          { name: 'Hugging Face', patterns: ['huggingface', 'transformers'], files: [] },
          { name: 'LangChain', patterns: ['langchain'], files: [] }
        ],
        libraries: [
          { name: 'Pandas', patterns: ['pandas'], files: [] },
          { name: 'NumPy', patterns: ['numpy'], files: [] },
          { name: 'Matplotlib', patterns: ['matplotlib'], files: [] },
          { name: 'Seaborn', patterns: ['seaborn'], files: [] },
          { name: 'Plotly', patterns: ['plotly'], files: [] },
          { name: 'Jupyter', patterns: ['jupyter', 'notebook'], files: [] }
        ],
        domains: [
          { name: 'Machine Learning', patterns: ['machine learning', 'ml'], files: [] },
          { name: 'Deep Learning', patterns: ['deep learning', 'neural network'], files: [] },
          { name: 'NLP', patterns: ['nlp', 'natural language processing'], files: [] },
          { name: 'Computer Vision', patterns: ['computer vision', 'cv', 'image processing'], files: [] },
          { name: 'Reinforcement Learning', patterns: ['reinforcement learning', 'rl'], files: [] }
        ]
      },
      mobile: {
        frameworks: [
          { name: 'React Native', patterns: ['react native', 'react-native'], files: [] },
          { name: 'Flutter', patterns: ['flutter'], files: [] },
          { name: 'Swift', patterns: ['swift'], files: [] },
          { name: 'Kotlin', patterns: ['kotlin'], files: [] },
          { name: 'Xamarin', patterns: ['xamarin'], files: [] },
          { name: 'Ionic', patterns: ['ionic'], files: [] },
          { name: 'Cordova', patterns: ['cordova', 'phonegap'], files: [] }
        ],
        platforms: [
          { name: 'iOS', patterns: ['ios', 'iphone', 'ipad'], files: [] },
          { name: 'Android', patterns: ['android'], files: [] },
          { name: 'Cross-platform', patterns: ['cross-platform', 'multi-platform'], files: [] },
          { name: 'Hybrid', patterns: ['hybrid'], files: [] }
        ]
      },
      testing: {
        frameworks: [
          { name: 'Jest', patterns: ['jest'], files: ['jest.config.js'] },
          { name: 'Mocha', patterns: ['mocha'], files: [] },
          { name: 'Jasmine', patterns: ['jasmine'], files: [] },
          { name: 'Karma', patterns: ['karma'], files: [] },
          { name: 'Cypress', patterns: ['cypress'], files: ['cypress.config.js'] },
          { name: 'Playwright', patterns: ['playwright'], files: [] },
          { name: 'Selenium', patterns: ['selenium'], files: [] },
          { name: 'Testing Library', patterns: ['testing-library', '@testing-library'], files: [] }
        ],
        types: [
          { name: 'Unit Testing', patterns: ['unit test', 'unit testing'], files: [] },
          { name: 'Integration Testing', patterns: ['integration test', 'integration testing'], files: [] },
          { name: 'E2E Testing', patterns: ['e2e', 'end-to-end', 'cypress'], files: [] },
          { name: 'Performance Testing', patterns: ['performance test', 'load test'], files: [] }
        ]
      },
      security: {
        concepts: [
          { name: 'OAuth', patterns: ['oauth'], files: [] },
          { name: 'JWT', patterns: ['jwt', 'jsonwebtoken'], files: [] },
          { name: 'SSL/TLS', patterns: ['ssl', 'tls', 'https'], files: [] },
          { name: 'Encryption', patterns: ['encryption', 'encrypt'], files: [] },
          { name: 'Authentication', patterns: ['authentication', 'auth'], files: [] },
          { name: 'Authorization', patterns: ['authorization', 'rbac'], files: [] }
        ],
        tools: [
          { name: 'OWASP', patterns: ['owasp'], files: [] },
          { name: 'Burp Suite', patterns: ['burp suite'], files: [] },
          { name: 'Metasploit', patterns: ['metasploit'], files: [] },
          { name: 'Nmap', patterns: ['nmap'], files: [] }
        ]
      },
      blockchain: {
        platforms: [
          { name: 'Ethereum', patterns: ['ethereum', 'eth'], files: [] },
          { name: 'Bitcoin', patterns: ['bitcoin', 'btc'], files: [] },
          { name: 'Polygon', patterns: ['polygon', 'matic'], files: [] },
          { name: 'Solana', patterns: ['solana'], files: [] },
          { name: 'Avalanche', patterns: ['avalanche', 'avax'], files: [] }
        ],
        languages: [
          { name: 'Solidity', patterns: ['solidity', '.sol'], files: [] },
          { name: 'Rust', patterns: ['rust'], files: [] },
          { name: 'Go', patterns: ['go', 'golang'], files: [] },
          { name: 'JavaScript', patterns: ['javascript', 'web3.js', 'ethers.js'], files: [] }
        ],
        concepts: [
          { name: 'Smart Contracts', patterns: ['smart contract'], files: [] },
          { name: 'DApps', patterns: ['dapp', 'decentralized app'], files: [] },
          { name: 'DeFi', patterns: ['defi', 'decentralized finance'], files: [] },
          { name: 'NFT', patterns: ['nft', 'non-fungible token'], files: [] },
          { name: 'DAO', patterns: ['dao', 'decentralized autonomous organization'], files: [] }
        ]
      }
    };
  }

  async detectTechnologies(data, baseUrl = '') {
    try {
      const detectedTech = {
        frontend: [],
        backend: [],
        databases: [],
        cloud: [],
        devops: [],
        ai_ml: [],
        mobile: [],
        testing: [],
        security: [],
        blockchain: [],
        all: [],
        confidence: {}
      };

      let html = '';
      let projects = [];

      if (data.html) {
        html = data.html;
      }

      if (data.projects) {
        projects = data.projects;
      }

      // Detect from HTML
      if (html) {
        const htmlDetection = this.detectFromHTML(html);
        this.mergeDetections(detectedTech, htmlDetection);
      }

      // Detect from projects
      if (projects.length > 0) {
        const projectDetection = this.detectFromProjects(projects);
        this.mergeDetections(detectedTech, projectDetection);
      }

      // Detect from URLs and additional sources
      if (baseUrl) {
        const additionalDetection = await this.detectFromAdditionalSources(baseUrl);
        this.mergeDetections(detectedTech, additionalDetection);
      }

      // Calculate confidence scores
      detectedTech.confidence = this.calculateConfidenceScores(detectedTech);

      return detectedTech;
    } catch (error) {
      console.error('Error detecting technologies:', error);
      return {
        frontend: [],
        backend: [],
        databases: [],
        cloud: [],
        devops: [],
        ai_ml: [],
        mobile: [],
        testing: [],
        security: [],
        blockchain: [],
        all: [],
        confidence: {}
      };
    }
  }

  detectFromHTML(html) {
    const $ = cheerio.load(html);
    const detected = {
      frontend: [],
      backend: [],
      databases: [],
      cloud: [],
      devops: [],
      ai_ml: [],
      mobile: [],
      testing: [],
      security: [],
      blockchain: [],
      all: []
    };

    const text = $('body').text().toLowerCase();
    const htmlSource = html.toLowerCase();

    // Check script tags
    $('script').each((i, element) => {
      const src = $(element).attr('src') || '';
      const content = $(element).text() || '';
      const scriptText = (src + ' ' + content).toLowerCase();

      this.checkTechnologyPatterns(scriptText, detected);
    });

    // Check link tags
    $('link').each((i, element) => {
      const href = $(element).attr('href') || '';
      const rel = $(element).attr('rel') || '';
      const linkText = (href + ' ' + rel).toLowerCase();

      this.checkTechnologyPatterns(linkText, detected);
    });

    // Check meta tags
    $('meta').each((i, element) => {
      const name = $(element).attr('name') || '';
      const content = $(element).attr('content') || '';
      const metaText = (name + ' ' + content).toLowerCase();

      this.checkTechnologyPatterns(metaText, detected);
    });

    // Check class names and IDs
    $('[class], [id]').each((i, element) => {
      const className = $(element).attr('class') || '';
      const id = $(element).attr('id') || '';
      const selectorText = (className + ' ' + id).toLowerCase();

      this.checkTechnologyPatterns(selectorText, detected);
    });

    // Check text content
    this.checkTechnologyPatterns(text, detected);

    return detected;
  }

  detectFromProjects(projects) {
    const detected = {
      frontend: [],
      backend: [],
      databases: [],
      cloud: [],
      devops: [],
      ai_ml: [],
      mobile: [],
      testing: [],
      security: [],
      blockchain: [],
      all: []
    };

    projects.forEach(project => {
      const projectText = `${project.name} ${project.description || ''} ${(project.technologies || []).join(' ')}`.toLowerCase();
      
      this.checkTechnologyPatterns(projectText, detected);

      // Check project URLs
      if (project.url) {
        this.checkTechnologyPatterns(project.url.toLowerCase(), detected);
      }

      // Check project technologies
      if (project.technologies) {
        project.technologies.forEach(tech => {
          this.checkTechnologyPatterns(tech.toLowerCase(), detected);
        });
      }
    });

    return detected;
  }

  async detectFromAdditionalSources(baseUrl) {
    const detected = {
      frontend: [],
      backend: [],
      databases: [],
      cloud: [],
      devops: [],
      ai_ml: [],
      mobile: [],
      testing: [],
      security: [],
      blockchain: [],
      all: []
    };

    try {
      // Check for common technology files
      const techFiles = [
        'package.json',
        'composer.json',
        'Gemfile',
        'requirements.txt',
        'Pipfile',
        'yarn.lock',
        'package-lock.json',
        'Dockerfile',
        'docker-compose.yml',
        'kubernetes.yml',
        'terraform.tf',
        'webpack.config.js',
        'vite.config.js',
        'next.config.js',
        'nuxt.config.js',
        'gatsby-config.js',
        'jest.config.js',
        'cypress.config.js',
        'tailwind.config.js'
      ];

      for (const file of techFiles) {
        try {
          const url = this.resolveUrl(file, baseUrl);
          const response = await axios.get(url, { timeout: 5000 });
          
          if (response.status === 200) {
            const fileContent = response.data.toLowerCase();
            this.checkTechnologyPatterns(fileContent, detected);
          }
        } catch (error) {
          // File doesn't exist or not accessible, continue
        }
      }
    } catch (error) {
      console.error('Error detecting from additional sources:', error);
    }

    return detected;
  }

  checkTechnologyPatterns(text, detected) {
    Object.entries(this.technologyPatterns).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategory, items]) => {
        items.forEach(item => {
          const patterns = Array.isArray(item.patterns) ? item.patterns : [item.patterns];
          
          patterns.forEach(pattern => {
            if (text.includes(pattern.toLowerCase())) {
              const techName = item.name || pattern;
              
              if (!detected[category].includes(techName)) {
                detected[category].push(techName);
              }
              
              if (!detected.all.includes(techName)) {
                detected.all.push(techName);
              }
            }
          });
        });
      });
    });
  }

  mergeDetections(target, source) {
    Object.keys(source).forEach(category => {
      if (category === 'all') {
        source.all.forEach(tech => {
          if (!target.all.includes(tech)) {
            target.all.push(tech);
          }
        });
      } else {
        source[category].forEach(tech => {
          if (!target[category].includes(tech)) {
            target[category].push(tech);
          }
        });
      }
    });
  }

  calculateConfidenceScores(detectedTech) {
    const confidence = {};
    
    Object.keys(detectedTech).forEach(category => {
      if (category === 'all' || category === 'confidence') return;
      
      const techs = detectedTech[category];
      if (techs.length === 0) {
        confidence[category] = 0;
        return;
      }

      // Calculate confidence based on multiple factors
      let categoryConfidence = 0;
      
      techs.forEach(tech => {
        let techConfidence = 0.5; // Base confidence
        
        // Higher confidence for well-known technologies
        if (this.isWellKnownTechnology(tech)) {
          techConfidence += 0.2;
        }
        
        // Higher confidence if found in multiple places
        const occurrences = this.countTechnologyOccurrences(tech, detectedTech);
        techConfidence += Math.min(occurrences * 0.1, 0.3);
        
        categoryConfidence += techConfidence;
      });
      
      confidence[category] = Math.min(categoryConfidence / techs.length, 1);
    });
    
    return confidence;
  }

  isWellKnownTechnology(tech) {
    const wellKnown = [
      'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'Google Cloud', 'Jest', 'Cypress', 'Tailwind CSS',
      'Bootstrap', 'Material-UI', 'Ant Design', 'TensorFlow', 'PyTorch',
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Git', 'GitHub'
    ];
    
    return wellKnown.includes(tech);
  }

  countTechnologyOccurrences(tech, detectedTech) {
    let count = 0;
    
    Object.keys(detectedTech).forEach(category => {
      if (category === 'all' || category === 'confidence') return;
      
      if (detectedTech[category].includes(tech)) {
        count++;
      }
    });
    
    return count;
  }

  resolveUrl(path, baseUrl) {
    try {
      if (path.startsWith('http')) {
        return path;
      }
      
      const base = new URL(baseUrl);
      if (path.startsWith('/')) {
        return `${base.protocol}//${base.host}${path}`;
      } else {
        return `${baseUrl}/${path}`;
      }
    } catch (error) {
      return path;
    }
  }

  getTechnologyCategory(technology) {
    const techLower = technology.toLowerCase();
    
    for (const [category, subcategories] of Object.entries(this.technologyPatterns)) {
      for (const [subcategory, items] of Object.entries(subcategories)) {
        for (const item of items) {
          const patterns = Array.isArray(item.patterns) ? item.patterns : [item.patterns];
          
          if (patterns.some(pattern => techLower.includes(pattern.toLowerCase()))) {
            return category;
          }
        }
      }
    }
    
    return 'other';
  }

  getTechnologyDetails(technology) {
    const techLower = technology.toLowerCase();
    
    for (const [category, subcategories] of Object.entries(this.technologyPatterns)) {
      for (const [subcategory, items] of Object.entries(subcategories)) {
        for (const item of items) {
          const patterns = Array.isArray(item.patterns) ? item.patterns : [item.patterns];
          
          if (patterns.some(pattern => techLower.includes(pattern.toLowerCase()))) {
            return {
              name: item.name || technology,
              category,
              subcategory,
              patterns: item.patterns,
              files: item.files || []
            };
          }
        }
      }
    }
    
    return {
      name: technology,
      category: 'other',
      subcategory: 'unknown',
      patterns: [],
      files: []
    };
  }

  getTechnologyStack(detectedTech) {
    const stack = {
      frontend: detectedTech.frontend || [],
      backend: detectedTech.backend || [],
      databases: detectedTech.databases || [],
      cloud: detectedTech.cloud || [],
      devops: detectedTech.devops || [],
      ai_ml: detectedTech.ai_ml || [],
      mobile: detectedTech.mobile || [],
      testing: detectedTech.testing || [],
      security: detectedTech.security || [],
      blockchain: detectedTech.blockchain || []
    };

    // Determine primary stack
    const stackTypes = [];
    
    if (stack.frontend.length > 0 && stack.backend.length > 0) {
      stackTypes.push('full-stack');
    } else if (stack.frontend.length > 0) {
      stackTypes.push('frontend');
    } else if (stack.backend.length > 0) {
      stackTypes.push('backend');
    }

    if (stack.mobile.length > 0) {
      stackTypes.push('mobile');
    }

    if (stack.ai_ml.length > 0) {
      stackTypes.push('ai/ml');
    }

    if (stack.devops.length > 0) {
      stackTypes.push('devops');
    }

    if (stack.cloud.length > 0) {
      stackTypes.push('cloud');
    }

    if (stack.blockchain.length > 0) {
      stackTypes.push('blockchain');
    }

    return {
      ...stack,
      types: stackTypes,
      primary: stackTypes[0] || 'unknown',
      diversity: Object.values(stack).reduce((sum, arr) => sum + arr.length, 0)
    };
  }

  getTechnologyRecommendations(detectedTech) {
    const recommendations = [];
    
    // Frontend recommendations
    if (detectedTech.frontend.length === 0) {
      recommendations.push({
        category: 'frontend',
        message: 'Consider adding frontend technologies to showcase UI/UX skills',
        suggested: ['React', 'Vue.js', 'Tailwind CSS']
      });
    }

    // Backend recommendations
    if (detectedTech.backend.length === 0) {
      recommendations.push({
        category: 'backend',
        message: 'Consider adding backend technologies to demonstrate server-side skills',
        suggested: ['Node.js', 'Express', 'Python', 'Django']
      });
    }

    // Testing recommendations
    if (detectedTech.testing.length === 0) {
      recommendations.push({
        category: 'testing',
        message: 'Consider adding testing frameworks to show quality assurance skills',
        suggested: ['Jest', 'Cypress', 'Testing Library']
      });
    }

    // Cloud recommendations
    if (detectedTech.cloud.length === 0) {
      recommendations.push({
        category: 'cloud',
        message: 'Consider adding cloud platforms to demonstrate modern deployment skills',
        suggested: ['AWS', 'Vercel', 'Netlify']
      });
    }

    // DevOps recommendations
    if (detectedTech.devops.length === 0) {
      recommendations.push({
        category: 'devops',
        message: 'Consider adding DevOps tools to show infrastructure skills',
        suggested: ['Docker', 'GitHub Actions', 'CI/CD']
      });
    }

    return recommendations;
  }
}

export const technologyDetection = new TechnologyDetectionService();
export default technologyDetection;
