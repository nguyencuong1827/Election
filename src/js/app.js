App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
  
      App.listenForEvents();
  
      return App.render();
    });
  },
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
  
    //loader.show();
    //content.hide();
    loader.hide();
    content.show();
      
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  
    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var content = $("#content");
      content.empty();
      
      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();


      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];
          var urlAvatar = candidate[3];
  
          // Render candidate Result
          var candidateTemp = '<div class="col-lg-6 container text-center" > <img src="' + urlAvatar + '" width="200" height="200"/> <h2>' + name + '</h2><h3>'+ voteCount  +'<span><img src="./images/vote-count.png" width="30" height="30"/></span></h3><button onclick="App.castVote('+id+'); return false;" class="btn btn-primary"><img src="./images/vote-button.png" width="50" height="50"/></button> </div>'
          // Render candidate ballot option
          content.append(candidateTemp);
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      

      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },
  castVote: function(candidateId) {
    // var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
    console.log(id);
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});