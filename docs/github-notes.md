### to force only one version of microbitcoin-payment-gateway

rm -rf .git;
git init;
find . -exec touch {} \;
git add .;
git commit -m "Initial commit";
git remote add origin https://github.com/coranos/microbitcoin-payment-gateway.git;
git push -u --force origin master;
git branch --set-upstream-to=origin/master master;
git pull;git push;
