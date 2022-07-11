import server from './server';

function main() {
  server.listen(3000, () => {
    console.log('Listening on 3000');
  });
}

main();
