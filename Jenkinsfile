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
        
stage('Debug App Files') {
    steps {
        bat 'echo === CURRENT GIT COMMIT ==='
        bat 'git rev-parse HEAD'

        bat 'echo === APP SOURCE IN JENKINS ==='
        bat 'type src\\app.js'

        bat 'echo === TRACKED HTML FILES ==='
        bat 'git ls-files public'

        bat 'echo === CHECK HTML FILES ==='
        bat 'if exist public\\login.html (echo login.html FOUND) else (echo login.html MISSING)'
        bat 'if exist public\\home.html (echo home.html FOUND) else (echo home.html MISSING)'
    }
}

        stage('Check HTML Files') {
            steps {
                bat 'echo Current directory:'
                bat 'cd'
                bat 'echo Checking public folder:'
                bat 'dir public'
                bat 'echo Checking expected files:'
                bat 'if exist public\\login.html (echo login.html FOUND) else (echo login.html MISSING)'
                bat 'if exist public\\home.html (echo home.html FOUND) else (echo home.html MISSING)'
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
            post {
                always {
                    junit testResults: 'junit.xml'
                }
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
                echo Checking existing container...

                docker inspect nodeapp-cicd >NUL 2>&1
                if not errorlevel 1 (
                    docker rm -f nodeapp-cicd
                    if errorlevel 1 exit /b 1
                )

                echo Pulling latest image...
                docker pull %DOCKER_IMAGE%:%BUILD_NUMBER%
                if errorlevel 1 exit /b 1

                echo Starting container...
                docker run -d ^
                    --name nodeapp-cicd ^
                    --restart unless-stopped ^
                    -p 3000:3000 ^
                    %DOCKER_IMAGE%:%BUILD_NUMBER%

                if errorlevel 1 exit /b 1

                echo Container deployed successfully.
                docker ps --filter "name=nodeapp-cicd"
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