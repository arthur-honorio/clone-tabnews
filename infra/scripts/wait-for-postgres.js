const { exec } = require("node:child_process");

function checkConnection() {
  exec("docker exec postgres-dev pg_isready --host postgres-dev", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkConnection();
      return;
    }
    process.stdout.write("\n\n🟢 Postgres pronto e aceitando conexões\n\n");
    return;
  }
}

process.stdout.write("🔴 Aguardando Postgres aceitar conexões");
checkConnection();
