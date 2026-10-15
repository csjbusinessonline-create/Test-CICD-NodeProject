pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/csjbusinessonline-create/Test-CICD-NodeProject.git'
            }
        }

        stage('Check Node.js and npm') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build --if-present'
            }
        }
    }

    post {
        success {
            echo 'Node.js CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the Console Output.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}