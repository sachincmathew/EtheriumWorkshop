module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    live: {
      host: "178.25.19.88", // Random IP for example purposes (do not use)
      port: 80,
      network_id: 1,        // Ethereum public network
    },
    rinkeby: {
      host: "127.0.0.1", // Random IP for example purposes (do not use)
      port: 8545,
      network_id: "*",        // Ethereum public network
    }
  }
};
