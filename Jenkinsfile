pipeline {
    agent any 
    
    stages { 
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'main', url: 'https://github.com/csjbusinessonline-create/Test-CICD-NodeProject.git'
                }
            }
        }
        stage('Build Docker Image') {
            steps {  
                bat 'docker build -t chamupathisaranga/nodeapp:%BUILD_NUMBER% .'
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
                bat 'docker push chamupathisaranga/nodeapp:%BUILD_NUMBER%'
            }
        }
    }
    post {
        always {
            bat 'docker logout'
        }
    }
}
