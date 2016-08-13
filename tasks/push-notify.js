/*jslint node: true, indent: 2 */
'use strict';
/**
 * Utilities for configuration settings
 *
 * @type {Object}
 */
var Config = require('../env');
var config = new Config();
/**
 * The Sequelize Model Object
 *
 * @type {Sequelize}
 */
var models = require('../db/models/index');
/**
 * Include the moment library
 * @param  {Object}
 */
var moment = require('moment-timezone');
/**
 * Library for handling messaging Android cloud
 *
 * @type {Object}
 */
var gcm = require('android-gcm');
/**
 * Library for handling messaging Apple Push cloud
 *
 * @type {Object}
 */
var apn = require('apn');
/**
 * The APN connection to use
 *
 * @type {Object}
 */
var apnConnection;

function PushNotifyTask() {
  var self = this;
  /**
   * Initialize APN
   */
  apnConnection = new apn.Connection({
    cert: config.apple.certificate,
    passphrase: config.apple.passphrase,
    production: config.apple.productionGateway
  });
  this.getTasks().then(function(tasks) {
    for (var i = 0; i < tasks.length; i++) {
      self.handleTask(tasks[i]);
    }
  });
}
/**
 * Get all the tasks within a 1 hour block before and after now.
 *
 * @return {Array} An array of tasks
 * @access public
 */
PushNotifyTask.prototype.getTasks = function() {
  var startDate = moment().subtract(14, 'minute').subtract(59, 'second').utc().format();
  var endDate = moment().add(14, 'minute').add(59, 'second').utc().format();
  return models.Task.findAll({
    where: {
      deliverOn: {
        $lte: endDate,
        $gte: startDate
      }
    }
  }).then(function(tasks) {
    return tasks;
  });
};
/**
 * Handle the given Task
 *
 * @param  {Task} task  The task to handle
 * @return {Void}
 * @access public
 */
PushNotifyTask.prototype.handleTask = function(task) {
  var self = this;
  // Find the Rumination and Consumer
  models.Rumination.findById(task.RuminationId, {
    include: [models.Consumer]
  }).then(function(rumination) {
    // Create the response
    var question =  self.getRandomQuestion();
    var consumer = rumination.Consumer;
    var response = {
      questionTheme: question.theme,
      questionContent: question.question,
      answer: ''
    };
    rumination.createResponse(response).then(function() {
      // Push notify the user
      if ((consumer.pushReceive) && (consumer.pushToken !== '') && (consumer.pushToken !== 'pending')) {
        var platform = consumer.devicePlatform.toLowerCase();
        if (platform === 'android') {
          self.pushAndroid(consumer, question);
        } else if (platform === 'ios') {
          self.pushApple(consumer, question);
        }
      }
      // Delete the task
      task.destroy();
    });
  });
};
/**
 * Pick a random question
 *
 * @return {Object} The question
 * @access public
 */
PushNotifyTask.prototype.getRandomQuestion = function () {
  var questions = this.getQuestions();
  return questions[Math.floor(Math.random()*questions.length)];
};
/**
 * Get a list of Questions
 *
 * @return {Array} An array of questions
 * @access public
 */
PushNotifyTask.prototype.getQuestions = function () {
  return [
    {
      theme:    'Context',
      question: 'What did this Scripture mean when it was written?'
    },
    {
      theme:    'Application',
      question: 'What is the timeless truth behind what God is saying?'
    },
    {
      theme:    'Application',
      question: 'How does it apply now to me?'
    },
    {
      theme:    'God\'s Character',
      question: 'What does this passage teach about God?'
    },
    {
      theme:    'Character of God',
      question: 'What work is God doing?'
    },
    {
      theme:    'God',
      question: 'How does the biblical author point us to God in this text?'
    },
    {
      theme:    'Glory of God',
      question: 'How does this passage either reveal or reflect the glory of God?'
    },
    {
      theme:    'Context',
      question: 'How this passage fit in the bigger picture of salvation history?'
    },
    {
      theme:    'Application',
      question: 'What should I be aspiring to on the basis of this text?'
    },
    {
      theme:    'Application',
      question: 'How can I praise God through this passage?'
    },
    {
      theme:    'Context',
      question: 'What is going on in the passage?'
    },
    {
      theme:    'Dig Deeper',
      question: 'What is the good news in this passage?'
    },
    {
      theme:    'Nature of Man',
      question: 'What does this passage say about who we are?'
    },
    {
      theme:    'Application',
      question: 'How does this passage call us to a new way of life?'
    },
    {
      theme:    'Meditation',
      question: 'What have I been thinking about as I have read this passage? Why?'
    },
    {
      theme:    'Insight',
      question: 'What’s something you noticed for the first time?'
    },
    {
      theme:    'Context',
      question: 'What is going on in the passage?'
    },
    {
      theme:    'Insight',
      question: 'What are some difficult words or concepts in your passage that you do not know or that need clarifying?'
    },
    {
      theme:    'Insight',
      question: 'What stands out to you in this passage?'
    },
    {
      theme:    'Context',
      question: 'What do you think the main point is?'
    },
    {
      theme:    'Application',
      question: 'What is one way you can apply this truth to your life this week?'
    }
  ];
};
/**
 * Send a push notification to an Android device
 *
 * @param  {Consumer} consumer The consumer receiving the push
 * @param  {Object}   question The question being asked
 * @return {Void}
 * @access public
 */
PushNotifyTask.prototype.pushAndroid = function(consumer, question) {
  if (config.android.apiKey !== '') {
    var gcmObject = new gcm.AndroidGcm(config.android.apiKey);
    var message = new gcm.Message({
      registration_ids: [consumer.pushToken],
      data: {
        message: question.question,
        title: 'Can We Ask You a Question?',
        vibrate: 1,
        sound: 'default'
      }
    });
    gcmObject.send(message, function(err) {
      if (err) {
        console.log('Error: ' + err);
      } else {
        console.log('Sent message to API key ' + consumer.apiKey);
      }
    });
  }
};
/**
 * Send a push notification to an Apple device
 *
 * @param  {Consumer} consumer The consumer receiving the push
 * @param  {Object}   question The question being asked
 * @return {Void}
 * @access public
 */
PushNotifyTask.prototype.pushApple = function(consumer, question) {
  if (config.apple.certificate) {
    var myDevice = new apn.Device(consumer.pushToken);
    var note = new apn.Notification();
    /**
     * Expires 1 hour from now.
     */
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 0;
    note.sound = 'default';
    note.alert = question.question;
    note.payload = {'messageFrom': 'Ruminate'};

    if(apnConnection) {
      apnConnection.pushNotification(note, myDevice);
    }
  }
};

new PushNotifyTask();
