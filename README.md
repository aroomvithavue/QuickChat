# QuickChat

## Project Structure

Frontend

Backend

## Deploying to Heroku

### Install Heroku CLI and login

```
brew tap heroku/brew && brew install heroku
heroku login
```

### Set up git remotes

```
heroku git:remote -a quickchat-web-client -r heroku-web-client
heroku git:remote -a quickchat-api-61040 -r heroku-api
```

### Push new deployment to heroku

#### Frontend

```
git push heroku-web-client HEAD:master
```

**Note**: Add -f flag if your branch is conflicting with heroku master branch, but be aware of the dangers of force pushing. This will also override any deployment currently on Heroku. Only push a clean main branch to Heroku.

#### Backend

```
git push heroku-api HEAD:master
```

**Note**: Add -f flag if your branch is conflicting with heroku master branch, but be aware of the dangers of force pushing. This will also override any deployment currently on Heroku. Only push a clean main branch to Heroku.
