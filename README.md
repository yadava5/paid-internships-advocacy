# Paid Internships Advocacy

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

**An advocacy website promoting paid internships for students**

*Built for ENG109 Final Project at Miami University, Oxford, Ohio*

[View Live Demo](#) · [Report Bug](../../issues/new?template=bug_report.md) · [Request Feature](../../issues/new?template=feature_request.md)

</div>

---

## 📖 About The Project

This website advocates for fair compensation in student internships, featuring immersive Apple-style design with 3D scroll animations, interactive data visualizations backed by academic research, and comprehensive student story collections.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎬 **Immersive Design** | Apple product launch-style UI with 3D scroll effects, glassmorphism, and cinematic animations |
| 📊 **Data Visualizations** | Interactive Chart.js dashboards with research-backed statistics from NACE, Harvard, Fed Reserve |
| 📝 **Student Stories** | Full-screen testimonials with carousel navigation and sector filtering |
| 📋 **Research Survey** | Multi-step form with premium UI components for collecting student experiences |
| 🌙 **Dark Theme** | Sleek dark aesthetic with gradient accents and smooth transitions |
| 📱 **Fully Responsive** | Optimized for desktop, tablet, and mobile devices |

### 🎓 Course Context

Created as a multimodal digital composition project for **ENG109** at **Miami University, Oxford, Ohio**. The project explores digital rhetoric, visual design, and social advocacy to highlight the issue of unpaid internships affecting students nationwide.

---

## 🛠️ Tech Stack

- **Framework:** Bootstrap 5.3.3
- **Icons:** Bootstrap Icons 1.11.3
- **Charts:** Chart.js 4.4.2
- **JavaScript:** Vanilla ES6+ modules
- **Styling:** Custom CSS with CSS Variables
- **Fonts:** System fonts stack
- **Hosting:** Static (GitHub Pages compatible)

---

## 📁 Project Structure

```
paid-internships-advocacy/
├── .github/                    # GitHub templates
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── assets/
│   ├── css/
│   │   └── custom.css         # All custom styles
│   ├── data/
│   │   └── chart_data.json    # Chart.js data source
│   └── img/                   # Images and media
├── js/
│   ├── counters.js            # Animated counters
│   ├── dataCharts.js          # Data page charts
│   ├── effects.js             # Scroll & 3D effects
│   ├── homeMiniChart.js       # Homepage chart
│   ├── nav.js                 # Navigation logic
│   ├── stories.js             # Stories filtering
│   └── survey.js              # Survey form logic
├── docs/
│   └── architecture.md        # Technical documentation
├── index.html                 # Homepage
├── about.html                 # About page
├── data.html                  # Data & statistics
├── stories.html               # Student stories
├── survey.html                # Research survey
├── involved.html              # Get involved
├── legal.html                 # Legal information
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Local development server (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yadava5/paid-internships-advocacy.git
   cd paid-internships-advocacy
   ```

2. **Start a local server** (choose one)
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Node.js (npx)
   npx serve
   
   # PHP
   php -S localhost:8080
   ```

3. **Open in browser**
   ```
   http://localhost:8080
   ```

---

## 🌿 Branch Strategy

This project follows an industry-standard GitFlow branching model:

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch for features |
| `feature/*` | New pages or components |
| `enhancement/*` | Improvements to existing features |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation updates |

### Creating a New Feature

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Work on your feature...

# Push and create PR
git push origin feature/your-feature-name
```

---

## 📊 Data Sources

All statistics are backed by peer-reviewed research:

| Source | Data Used |
|--------|-----------|
| NACE | Hiring rates, employment outcomes |
| Harvard Business Review | Career advancement statistics |
| Federal Reserve Bank of NY | Wage premiums, economic impact |
| Brookings Institution | Income inequality data |
| Economic Policy Institute | Labor market analysis |
| American Psychological Association | Mental health impact |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) before submitting.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 👤 Author

**Ayush Yadav**
- GitHub: [@yadava5](https://github.com/yadava5)
- Project: [paid-internships-advocacy](https://github.com/yadava5/paid-internships-advocacy)

---

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) - CSS Framework
- [Chart.js](https://www.chartjs.org/) - Data Visualization
- [Bootstrap Icons](https://icons.getbootstrap.com/) - Icon Library
- Miami University ENG109 - Course & Guidance

---

<div align="center">

Made with ❤️ for fair internships

**Miami University, Oxford, Ohio**

</div>
