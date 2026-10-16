// pipeline {
//     agent any 
    
//     stages { 
//         stage('SCM Checkout') {
//             steps {
//                 retry(3) {
//                     git branch: 'main', url: 'https://github.com/csjbusinessonline-create/Test-CICD-NodeProject.git'
//                 }
//             }
//         }
//         stage('Build Docker Image') {
//             steps {  
//                 bat 'docker build -t chamupathisaranga/nodeapp:%BUILD_NUMBER% .'
//             }
//         }
//          stage('Login to Docker Hub') {
//             steps {
//                 withCredentials([string(credentialsId: 'samin-docker', variable: 'samindocker')]) {
//                     script {
//                         bat "docker login -u chamupathisaranga -p %samindocker%"
//                     }
//                 }
//             }
//         }
//         stage('Push Image') {
//             steps {
//                 bat 'docker push chamupathisaranga/nodeapp:%BUILD_NUMBER%'
//             }
//         }
//     }
//     post {
//         always {
//             bat 'docker logout'
//         }
//     }
// }




pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'chamupathisaranga/nodeapp'
    }

    stages {
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'main',
                        url: 'https://github.com/csjbusinessonline-create/Test-CICD-NodeProject.git'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        bat "\"${scannerHome}\\bin\\sonar-scanner.bat\""
                    }
                }
            }
        }
        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE%:%BUILD_NUMBER% .'
            }
        }
        stage('Login to Docker Hub') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'samin-docker',
                        variable: 'samindocker'
                    )
                ]) {
                    bat '''
                        @echo off
                        echo %samindocker% | docker login -u chamupathisaranga --password-stdin
                    '''
                }
            }
        }
        stage('Push Image') {
            steps {
                bat 'docker push %DOCKER_IMAGE%:%BUILD_NUMBER%'
            }
        }
    }
    post {
        always {
            bat 'docker logout || exit /b 0'
        }

        success {
            echo 'Pipeline successful: tests passed, quality gate passed, and Docker image pushed.'
        }

        failure {
            echo 'Pipeline failed. Check the failed stage and Console Output.'
        }
    }
}