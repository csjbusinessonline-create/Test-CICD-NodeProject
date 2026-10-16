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

    tools {
        nodejs 'Node26'
    }

    stages {
        stage('Checkout') {
            steps {
                retry(3) {
                    git branch: 'main',
                        url: 'https://github.com/csjbusinessonline-create/Test-CICD-NodeProject.git'
                }
            }
        }

        stage('Install') {
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

                    withSonarQubeEnv('SonarCloud') {
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
    }
}
