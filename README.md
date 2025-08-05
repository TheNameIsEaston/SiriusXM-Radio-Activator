# 🎵 SiriusXM Radio Activator

A web-based tool to activate SiriusXM radios through the dealer API interface.

## 🌐 Live Demo

**[View Live Demo on GitHub Pages](https://TheNameIsEaston.github.io/SiriusXM-Radio-Activator/)**

*Note: The GitHub Pages version is a static demo that shows the user interface only. For full functionality, run the Flask application locally.*

## ✨ Features

- Clean, modern web interface
- Real-time activation progress tracking
- Input validation for Radio IDs
- Responsive design for mobile and desktop
- Step-by-step activation process visualization

## 🚀 Quick Start (Full Version)

### Prerequisites
- Python 3.7+
- pip (Python package installer)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TheNameIsEaston/SiriusXM-Radio-Activator.git
cd SiriusXM-Radio-Activator
```

2. Install dependencies:
```bash
pip install flask requests
```

3. Run the application:
```bash
python main.py
```

4. Open your browser and navigate to `http://localhost:5000`

## 📱 Usage

1. Enter your 12-character Radio ID
2. Click "Activate Radio"
3. Monitor the progress in real-time
4. Wait for the activation to complete

### Finding Your Radio ID
- Check your radio's display menu
- Look in your vehicle's infotainment settings
- Refer to your SiriusXM documentation

## 🛠️ Technical Details

### Backend (Python Flask)
- **Framework**: Flask web framework
- **API Integration**: SiriusXM dealer API endpoints
- **Authentication**: Token-based authentication
- **Threading**: Asynchronous activation processing

### Frontend (HTML/CSS/JavaScript)
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Progress tracking via AJAX
- **Input Validation**: Client-side Radio ID validation
- **Modern UI**: Clean, professional interface

### Activation Process
The activation follows these steps:
1. App configuration setup
2. Authentication with SiriusXM services
3. Version control verification
4. Device property retrieval
5. Device update initiation
6. CRM data processing
7. Database updates
8. Blocklist verification
9. Oracle validation
10. Account creation
11. Final device refresh

## 🌐 GitHub Pages Deployment

This project includes a static version suitable for GitHub Pages deployment:

### Files for GitHub Pages:
- `index.html` - Static demo version
- `README.md` - Project documentation

### Deployment Steps:
1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Save and wait for deployment

## ⚠️ Important Notes

- **Demo Limitation**: The GitHub Pages version is for demonstration only
- **Backend Required**: Full functionality requires running the Python Flask app
- **API Access**: Actual activation requires access to SiriusXM dealer APIs
- **Educational Purpose**: This tool is for educational and authorized dealer use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is provided as-is for educational purposes. Please ensure you have proper authorization before using with actual SiriusXM services.

## 🔧 Development

### Project Structure
```
SiriusXM-Radio-Activator/
├── main.py                 # Flask application
├── templates/
│   └── index.html         # Flask template
├── index.html             # Static GitHub Pages version
├── README.md              # Documentation
├── pyproject.toml         # Python project configuration
└── generated-icon.png     # Project icon
```

### Local Development
1. Make changes to `main.py` for backend functionality
2. Update `templates/index.html` for Flask template changes
3. Modify `index.html` for GitHub Pages static version
4. Test locally before pushing to GitHub

## 📞 Support

If you encounter issues:
1. Check that your Radio ID is exactly 12 characters
2. Ensure you have proper network connectivity
3. Verify that the SiriusXM services are accessible
4. Review the console logs for detailed error information

---

**Disclaimer**: This tool is for educational purposes and authorized dealer use only. Ensure you have proper permissions before activating SiriusXM radios.