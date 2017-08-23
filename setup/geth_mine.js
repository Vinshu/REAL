
var eth, config, main, pendingTransactions, startTransactionMining;
eth = web3.eth;

console.log('geth_mine.js: start');
console.log("node infos: " + (JSON.stringify(admin.nodeInfo)));


config = {
  threads: 2 // set this to the number of threads you machine can handle, remember to set a low difficulty in your genesis block to mine faster
};

main = function() {
  var miner_obj;
  miner_obj = admin.miner === void 0 ? miner : admin.miner;
  miner_obj.stop();
  startTransactionMining(miner_obj);
  return true;
};

pendingTransactions = function() {
  if (!eth.pendingTransactions) {
    return txpool.status.pending || txpool.status.queued;
  } else if (typeof eth.pendingTransactions === 'function') {
    return eth.pendingTransactions().length > 0;
  } else {
    return eth.pendingTransactions.length > 0 || eth.getBlock('pending').transactions.length > 0;
  }
};

startTransactionMining = function(miner_obj) {
  eth.filter('pending').watch(function() {
    if (miner_obj.hashrate > 0) {
      return;
    }
    console.log('== Pending transactions! Looking for next block...');
    miner_obj.start(config.threads);
  });
  return eth.filter('latest').watch(function() {
    if (!pendingTransactions()) {
      console.log('== No transactions left. Stopping miner...');
      miner_obj.stop();
    }
  });
};

main(); 
