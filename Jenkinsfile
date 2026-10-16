// // pipeline {
// //     agent any 
    
// //     stages { 
// //         stage('SCM Checkout') {
// //             steps {
// //                 retry(3) {
// //                     git branch: 'main', url: 'https://github.com/csjbusinessonline-create/Test-CICD-NodeProject.git'
// //                 }
// //             }
// //         }
// //         stage('Build Docker Image') {
// //             steps {  
// //                 bat 'docker build -t chamupathisaranga/nodeapp:%BUILD_NUMBER% .'
// //             }
// //         }
// //          stage('Login to Docker Hub') {
// //             steps {
// //                 withCredentials([string(credentialsId: 'samin-docker', variable: 'samindocker')]) {
// //                     script {
// //                         bat "docker login -u chamupathisaranga -p %samindocker%"
// //                     }
// //                 }
// //             }
// //         }
// //         stage('Push Image') {
// //             steps {
// //                 bat 'docker push chamupathisaranga/nodeapp:%BUILD_NUMBER%'
// //             }
// //         }
// //     }
// //     post {
// //         always {
// //             bat 'docker logout'
// //         }
// //     }
// // }


// pipeline {
//     agent any

//     tools {
//         nodejs 'Node26'
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 retry(3) {
//                     git branch: 'main',
//                         url: 'https://github.com/csjbusinessonline-create/Test-CICD-NodeProject.git'
//                 }
//             }
//         }

//         stage('Install') {
//             steps {
//                 bat 'npm ci'
//             }
//         }

//         stage('Test') {
//             steps {
//                 bat 'npm test'
//             }
//         }

//         stage('SonarQube Analysis') {
//             steps {
//                 script {
//                     def scannerHome = tool 'SonarScanner'

//                     withSonarQubeEnv('SonarCloud') {
//                         bat "\"${scannerHome}\\bin\\sonar-scanner.bat\""
//                     }
//                 }
//             }
//         }

//         stage('Quality Gate') {
//             steps {
//                 timeout(time: 17, unit: 'MINUTES') {
//                     waitForQualityGate abortPipeline: true
//                 }
//             }
//         }
//     }
// }




pipeline {
    agent any

    tools {
        nodejs 'Node26'
    }

    environment {
        DOCKER_IMAGE = 'chamupathisaranga/nodeapp-cicd'
        DOCKER_USER = 'chamupathisaranga'
    }

    stages {
        stage('1. SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'main',
                        url: 'https://github.com/csjbusinessonline-create/Test-CICD-NodeProject.git'
                }
            }
        }

        stage('2. Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('3. Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('4. SonarCloud Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarCloud') {
                        bat "\"${scannerHome}\\bin\\sonar-scanner.bat\""
                    }
                }
            }
        }

        stage('5. Quality Gate') {
            steps {
                timeout(time: 17, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('6. Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE%:%BUILD_NUMBER% .'
            }
        }

        stage('7. Docker Hub Login') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'samin-docker',
                        variable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    bat '''
                        @echo off
                        echo %DOCKER_PASSWORD%| docker login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('8. Push Docker Image') {
            steps {
                bat 'docker push %DOCKER_IMAGE%:%BUILD_NUMBER%'
            }
        }
        
    stage('9. Deploy Container') {
        steps {
            bat '''
                @echo off
                docker inspect nodeapp-cicd >NUL 2>&1
                if not errorlevel 1 docker rm -f nodeapp-cicd
                if errorlevel 1 exit /b 1

                docker run -d ^
                    --name nodeapp-cicd ^
                    --restart unless-stopped ^
                    -p 8081:3000 ^
                    %DOCKER_IMAGE%:%BUILD_NUMBER%

                if errorlevel 1 exit /b 1
            '''
        }
    }

    stage('10. Verify Container') {
        steps {
            bat '''
                docker ps --filter "name=nodeapp-cicd"
                docker inspect --format="{{.State.Status}}" nodeapp-cicd
            '''
        }
    }

    }

    post {
        always {
            bat 'docker logout'
        }

        success {
            echo 'Pipeline completed successfully!'
            echo 'Docker image was pushed to Docker Hub.'
        }

        failure {
            echo 'Pipeline failed. Check the failed stage in Jenkins.'
        }

        aborted {
            echo 'Pipeline was aborted.'
        }
    }
}