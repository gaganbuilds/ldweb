export const mlCurriculumData = [
  {
    id: "module-1",
    moduleNum: "Module 1",
    title: "Python & Data Foundations",
    duration: "3 Weeks",
    label: "FOUNDATION",
    description: "Build the programming and data-analysis foundation required for Machine Learning.",
    weeks: [
      { week: 1, focus: "🐍 Python for ML", learn: "Python basics, functions, OOP basics, modules, exceptions, file handling, virtual environments", output: "Python mini-project" },
      { week: 2, focus: "📊 NumPy + Pandas", learn: "Arrays, indexing, dataframes, data cleaning, missing values, filtering, grouping, merging", output: "Data analysis mini-project" },
      { week: 3, focus: "📈 Data Visualization + EDA", learn: "Matplotlib, Seaborn, distributions, correlation, outliers, EDA workflow", output: "Complete EDA report" }
    ]
  },
  {
    id: "module-2",
    moduleNum: "Module 2",
    title: "Machine Learning Core",
    duration: "3 Weeks",
    label: "CORE",
    description: "Understand the fundamentals of Machine Learning and build your first supervised learning models.",
    weeks: [
      { week: 4, focus: "🧠 Machine Learning Foundations", learn: "What is ML, supervised/unsupervised learning, train/test split, features/labels, overfitting, underfitting, bias/variance", output: "First ML model" },
      { week: 5, focus: "📉 Regression", learn: "Linear regression, multiple regression, polynomial regression, MAE, MSE, RMSE, R²", output: "House/price prediction project" },
      { week: 6, focus: "🎯 Classification", learn: "Logistic regression, KNN, decision trees, random forest, SVM, confusion matrix, precision, recall, F1, ROC-AUC", output: "Classification project" }
    ]
  },
  {
    id: "module-3",
    moduleNum: "Module 3",
    title: "ML Engineering & Advanced ML",
    duration: "3 Weeks",
    label: "ADVANCED",
    description: "Move from individual models to complete ML workflows, advanced algorithms and model optimization.",
    weeks: [
      { week: 7, focus: "⚙️ ML Pipeline + Feature Engineering", learn: "Encoding, scaling, feature selection, preprocessing pipelines, cross-validation, hyperparameter tuning", output: "End-to-end ML pipeline" },
      { week: 8, focus: "🔍 Unsupervised ML", learn: "Clustering, K-Means, hierarchical clustering, PCA, anomaly detection", output: "Customer segmentation project" },
      { week: 9, focus: "🧠 Advanced ML + Model Selection", learn: "Ensemble learning, Random Forest, Gradient Boosting, XGBoost/LightGBM concepts, model comparison", output: "Kaggle-style ML challenge" }
    ]
  },
  {
    id: "module-4",
    moduleNum: "Module 4",
    title: "Deep Learning, Deployment & Career",
    duration: "3 Weeks",
    label: "CAREER READY",
    description: "Learn the foundations of Deep Learning, deploy ML applications and prepare for real-world ML opportunities.",
    weeks: [
      { week: 10, focus: "🤖 Deep Learning + GenAI Foundation", learn: "Neural networks, neurons, activation functions, forward/backpropagation, TensorFlow/Keras basics, introduction to LLMs and embeddings", output: "Neural-network project" },
      { week: 11, focus: "🚀 ML Deployment + MLOps Basics", learn: "Flask/FastAPI or Streamlit, model serialization, REST API, Git/GitHub, deployment, environment management", output: "Deploy an ML application" },
      { week: 12, focus: "💼 Job Readiness + Capstone", learn: "Capstone completion, GitHub, README, resume, LinkedIn, ML interview questions, mock interviews, aptitude", output: "Final deployed ML project + portfolio" }
    ]
  }
];
