var jsPsych = initJsPsych({
    extensions: [
        // {type: jsPsychExtensionWebgazer},
        {type: jsPsychExtensionMouseTracking}
    ],
    on_finish: function () {
        $.ajax({
            type: "POST",
            url: "/experiment-data",
            data: JSON.stringify(jsPsych.data.get().values()),
            contentType: "application/json"
        }).done(function() {
            alert("Data has been saved!");
            window.location.href = "finish";
        }).fail(function() {
            alert("Problem occurred while writing data. " +
                "Please contact the experimenter regarding this issue!");

        window.location.href = "finish";
    });
    }
}
);

// CONSTANTS
var TODAY = new Date();
var DD = String(TODAY.getDate()).padStart(2, '0');
var MM = String(TODAY.getMonth() + 1).padStart(2, '0');
var YYYY = TODAY.getFullYear();
const DATE = YYYY + MM + DD;

//Creating list of image paths to load for instructions.
const nImageInst = 8;
/** load all the instruction images, and remember to preload */
var instruct_img = [];
for (var i = 0; i < nImageInst; i++) {
  instruct_img.push('../../img/instruct' + i + '.png');
}

// experimental stimulus. 
var NamesOfFoods = [
  "orange",
  "plum",
  "blackberry",
  "peach",
  "cherry",
  "raspberry",
  "apple",
  "grape",
  "golden delicious apple",
  "honeydew melon",
  "kiwi",
  "green bell pepper",
  "carrot",
  "peanuts",
  "almonds",
  "baguette",
  "sliced loaf bread",
  "boule bread",
  "rye bread",
  "deli turkey",
  "chicken tenders",
  "meatballs",
  "gouda",
  "swiss cheese",
  "potato chips",
  "tortilla chips",
  "doritos",
  "ritz cracker",
  "saltine cracker",
  "wheat thins",
  "egg rolls",
  "french fries",
  "buttered popcorn",
  "triscuits",
  "wavy lays",
  "chocolate ice cream cone",
  "strawberry ice cream cone",
  "vanilla soft serve cone",
  "nutrigrain bar",
  "churro",
  "twist donut",
  "tuile cookie",
  "madeleine",
  "oatmeal raisin cookie",
  "thumbprint cookie",
  "sugar cookie",
  "vanilla wafer",
  "chocolate wafer",
  "chocolate bark",
  "dark chocolate",
  "milk chocolate",
  "pocky",
  "toblerone",
  "lindt lindor chocolate truffle",
  "twix",
  "caramel",
  "peanut M&M's",
  "brownie",
  "frosted brownie",
  "lemon cake"
];

 //Creating list of image paths to load for the main task
  var items_of_interest = [1, 5, 8, 12, 13, 16, 17, 18, 25, 26, 28, 33, 39, 51, 55, 60,
    61, 63, 65, 70, 77, 80, 93, 96, 98, 99, 100, 102, 103, 104, 105,
    106, 114, 115, 118, 119, 123, 124, 131, 142, 150, 153, 154, 155,
    158, 159, 160, 161, 164, 165, 168, 170, 172, 173, 174, 176, 184,
    187, 188, 200];
    var arrayLength = items_of_interest.length;
    
    var image_paths = [];
    for (var i = 0; i < arrayLength; i++) {
        // This for loop fills the image_paths list with urls to the images for each of the individual items
        var path_str1 = "../../img/60Foods/item" + String(items_of_interest[i]) + ".jpg";
        image_paths.push(path_str1);
    }

  const individual_shuffled_image_names = image_paths;
  var individual_items = [];
  var individual_items = individual_shuffled_image_names.map((img, index) => ({
      stimulus: img,
      names: NamesOfFoods[index] // Associate each img with a name from above
  }));
  var individual_items = jsPsych.randomization.shuffle(individual_items);
  const shuffled_image_names = jsPsych.randomization.shuffle(image_paths);
  const trial_options = shuffled_image_names.slice(0, 60); //for the total set

// Preloading files are needed to present the stimuli accurately.
const preload = {
  type: jsPsychPreload,
  images: [instruct_img, image_paths],   //  preload just the images
}

// Consent
var check_consent = function(elem) {
    if (document.getElementById('consent_checkbox').checked) {
        return true;
    }
    else {
        alert("If you wish to participate, you must check the box next to the statement ' I AGREE with the above consent.'");
        return false;
    }
    return false;
};

var informed_consent = {
    data: {
        screen_id: "consent"
    },
    type: jsPsychExternalHtml,
    url: "../../views/consent.html",
    cont_btn: "start",
    check_fn: check_consent
};

// Open Full Screen
var fullscreenEnter = {
  type: jsPsychFullscreen,
  message: `<div> Before we begin, please close any unnecessary programs or applications on your computer. <br/>
  This will help the study run more smoothly.    <br/>
  Also, please close any browser tabs that could produce popups or alerts that would interfere with the study.    <br/>
  Finally, once the study has started, <b>DO NOT EXIT</b> fullscreen mode or you will terminate the study and not receive any payment. <br/>
  <br><br/>
  The study will switch to full screen mode when you press the button below.<br/>
  When you are ready to begin, press the button.</div>
  <br><br/>`,
  fullscreen_mode: true,
};

// Welcome
// capture info from Prolific //
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');

var welcome_block_Prolific = {
    data: {
        screen_id: "welcome"
    },
    type: jsPsychSurveyHtmlForm,
    preamble: "<p>Welcome to the experiment!</p>"+
    "Please complete the form",
    html: "<p>PROLIFIC ID: <input name = 'subject_id' type = 'text'/></p>",
    on_finish: function(data) {
        responses = data.response;
        jsPsych.data.addProperties({
            subject_id: subject_id, //just add it from the variable about rather than responses.
            ID_DATE: responses.subject_id + "_" + DATE,
            browser_name: bowser.name,
            browser_type: bowser.version,
            windowWidth: $(window).width(),
            windowHight: $(window).height(),
            study_id: study_id,
            session_id: session_id
        })
    }
};

// Instructions I
var instruction_block_1 = {
    data: {screen_id: "instructions"},
    type: jsPsychInstructions,
    on_start:   () =>  document.body.style.cursor = 'none',
    pages: [
        '<p>Welcome to the study!</p>' +
                "<p>Today, you will make some decisions about foods.</p>" +
                "<p>There will be multiple parts to the study, and you will receive instructions before each new part.</p>"+
                "<p>If you have any questions, please contact the experimenter at kiante@ucla.edu. If you are ready to begin, please press the SPACEBAR.</p>",
    ],
    key_forward: ' '
};
// EYE TRACKING
// eye instructions
// var camera_instructions = {
//     on_start: () => document.body.style.cursor = 'pointer',
//     type: jsPsychHtmlButtonResponse,
//     stimulus: `
//     <p>In order to participate you must allow the experiment to use your camera.</p>
//     <p>You will be prompted to do this on the next screen.</p>
//     <p>If you do not wish to allow use of your camera, you cannot participate in this experiment.<p>
//     <p>It may take up to 30 seconds for the camera to initialize after you give permission.</p>
//     `,
//     choices: ['Got it'],
// }
// var eyeTrackingInstruction1 = {
//   type: jsPsychHtmlKeyboardResponse,
//   stimulus: `<div> <font size=120%; font color = 'green';>Calibration & Validation </font><br/>
//                                              <br><br/>
//                 Before we begin with the study, we need to turn on and adjust your webcam for eye-tracking.   <br/>

//                 There are two parts to this process. The first part is calibration and the second part is validation.<br/>
//                 <br><br/>
//                 During calibration, you will see a series of dots like this: <img height="25px" width="30px" src="${instruct_img[4]}"> appear on the screen, each for 3 seconds.<br/>
//                 Your task is simply to stare directly at each dot until it disappears.<br/>
//                 Then, quickly move your eyes to the next dot and repeat.<br/>
//                 <br><br/>
//                 Validation is basically the same as calibration. You simply need to stare at each dot until it turns disappears.<br/>
//                 <br><br/>
//                 When you are ready, press the SPACEBAR to continue. </div>`,
//   post_trial_gap: 500,
//   choices: ' ',

// }

// var eyeTrackingInstruction2 = {
//   type: jsPsychHtmlKeyboardResponse,
//   stimulus: `<div><font size=120%; font color = 'green';>Calibration & Validation </font><br/>
//                                                                           <br><br/>
//       When the calibration begins, you will see a video feed with your face at the top of your screen like this:  <br/>
//         <br><br/>
//          <img height="220px" width="270px" src="${instruct_img[0]}"><br/>
//        <br><br/>
//                          Try to keep your entire face within the box. When your face is in a good position, the box will turn <b><font color='green'>green</font></b>. <br/>
//                          <font size=5px; font color = 'red';> <b>NOTE</b>: the video feed only appears during calibration.</font><br/>
//                          <br><br/>
//                          <font size=5px; >When you are ready, press the  <b>SPACEBAR</b> to continue.</font>

//                          </div>`,
//   post_trial_gap: 500,
//   choices: ' ',

// }

// var eyeTrackingNote = {
//   type: jsPsychHtmlKeyboardResponse,
//   stimulus: `<div><font size=120%; font color = 'green';> Calibration & Validation</font><br/>
//                                                                           <br><br/>
//              <font size = 5px font color = "yellow">There are several <b>IMPORTANT</b> tips that are useful for passing the calibration task:<br/></font>
//              <img height="200px" width="1000px" src="${instruct_img[1]}"><br/>
//              <br><br/>
//              <div style="text-align-last:left">
//             In addition to the tips in the figure: <br/>
//             (1). Use your eyes to look around the screen and try to avoid moving your head. <br/>
//             (2). Try to keep lights in front of you rather than behind you so that the webcam can clearly see your face. Avoid sitting with a window behind you. <br/>
//             (3). After you have made these adjustments, check again that your face fits nicely within the box on the video feed and that the box is green. <br/></div>
//              <br><br/>
//              <font size=5px; font color = 'red';> <b>NOTE</b>:  <br/>
//             If you are seeing this page for a 2nd time, it means the calibration and validation did not work as well as we would like.  <br/>
//             Please read the tips above again, make any adjustments, and try again.  <br/>
//             There are only <b>TWO</b> chances to get this right.  <br/>
//             Otherwise, the study cannot proceed.  </font><br/>
//             <br><br/>
//              <font size=5px; >When you are ready, press the <b>SPACEBAR</b> to bring up the video feed and make these adjustments. </font></div>`,
//   post_trial_gap: 500,
//   choices: ' ',
// }
// initialize eye tracker
// var init_camera = {
//     type: jsPsychWebgazerInitCamera
// }
// Calibration eye tracking
// var calibration_instructions = {
//   type: jsPsychHtmlButtonResponse,
//   stimulus: `
//     <p>Now lets start the calibration.</p>
//     <p>You'll see a series of dots appear on the screen. Look at each dot.</p>
//   `,
//   choices: ['Got it'],
//   on_finish: () => document.body.style.cursor = 'none',
// }
// var calibration = {
//     type: jsPsychWebgazerCalibrate,
//     calibration_points: [
//         [25,25],[75,25],[50,50],[25,75],[75,75]
//     ],
//     repetitions_per_point: 2,
//     randomize_calibration_order: true,
//     calibration_mode: "view", //if view they look at points, if click they have to click on them
//     time_per_point: 3000 // change for testing. Should be 3000
// }
// validation eye tracking
// var validation_instructions = {
//  on_start: () => document.body.style.cursor = 'pointer',
//  type: jsPsychHtmlButtonResponse,
//  stimulus: `
//    <p>Now we'll measure the accuracy of the calibration.</p>
//    <p>Look at each dot as it appears on the screen.</p>
//      `,
//  choices: ['Got it'],
//  post_trial_gap: 1000,
//  on_finish: () => document.body.style.cursor = 'none'
// }
// var validation = {
//     type: jsPsychWebgazerValidate,
//     validation_points: [
//         [25,25],[75,25],[50,50],[25,75],[75,75]
//     ],
//     roi_radius: 200,
//     time_to_saccade: 1000,
//     validation_duration: 3000, // change for testing. Should be 3000
//     data: {
//         task: 'validate'
//     }
// }
// recalibrate eye tracking
// var recalibrate_instructions = {
//     on_start: () => document.body.style.cursor = 'pointer',
//     type: jsPsychHtmlButtonResponse,
//     stimulus: `
//     <p>The accuracy of the calibration is a little lower than desired.</p>
//     <p>Let's try calibrating one more time.</p>
//     <p>This is also your chance to take a break before proceeding further.</p>
//     <p>You can use this time to stretch, move your head, or take a quick bathroom break.</p>
//     <p>On the next screen, look at the dots.</p>
//     <p>When you're ready, press OK to continue.</p>
//     `,
//     choices: ['OK'],
//     on_finish: () => document.body.style.cursor = 'none'
// }
// var recalibrate = {
//     timeline: [recalibrate_instructions, calibration, validation_instructions, validation],
//     conditional_function: function () {
//       var validation_data = jsPsych.data.get().filter({ task: 'validate' }).values()[0];
//       return validation_data.percent_in_roi.some(function (x) {
//         var minimum_percent_acceptable = 70;
//         return x < minimum_percent_acceptable;
//       });
//     },
//     data: {
//       phase: 'recalibration'
//     },
//     on_finish: function () {
//       trial_count++;
//     }
//   }
// var calibration_done = {
//   on_start: () => document.body.style.cursor = 'pointer',
//   type: jsPsychHtmlButtonResponse,
//     stimulus: `
//     <p>Great, we're done with calibration!</p>
//     `,
//     choices: ['OK']
// }

  //Exposure period
var exposure_instruction = {
    data: { screen_id: "instructions" },
    on_start: () => document.body.style.cursor = 'none',
    type: jsPsychInstructions,
    pages: [
        "<p>To familiarize you with the set of snack foods in this study, we will now briefly show you each one.</p>" +
        "<p>Please press the SPACEBAR to begin</p>",
    ],
    key_forward: ' '
};
var exposure = {
    data: { screen_id: "exposure" },
    type: jsPsychImageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    prompt: jsPsych.timelineVariable('names'),
    trial_duration: [1000],
    stimulus_height: 520,
    stimulus_width: 650,
    response_ends_trial: false,
    on_start: function () {
        document.body.style.cursor = 'none'
    }
};

var exposure_sequence = {
    timeline: [exposure],
    timeline_variables: individual_items
};

// Experiment instructions
var exp_start_instructions = {
    data: {screen_id: "instructions"},
    type: jsPsychInstructions,
    pages: [
        '<p>We are now done with the practice rounds. The next part of the study involves real decisions.</p>'+
        "<p>If you have any questions, please contact the experimenter at neuroeconomics.osu@gmail.com. If you are ready to begin, please press the SPACEBAR.</p>",
    ],
    key_forward: ' '
};

//choice task
var fixation = {
    data: { screen_id: "fixation" },
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='font-size: 80px'>+</div>",
    trial_duration: [500],
    response_ends_trial: false
};

  // get ratings //
var ratingOverview = {
    type: jsPsychHtmlKeyboardResponse,
    on_start: () => document.body.style.cursor = 'none',
    stimulus: `<div> <font size=120%; font color = 'green';>Rating task</font><br/>
                                       <br><br/>
             <font size = 5%>Now, you will make decisions about each snack food one by one. <br/>
             For each snack food, please rate it on a scale from "Not at all" to "Very much" based on how much would you like this as a daily snack.<br/>
             A "Not at all" means that you would neither like nor dislike to eat this food.<br/>
             A "Very much" means that you would really love to eat this food.<br/>
             To rate an item, use the mouse to click anywhere along the slider scale. When you have rated an item, press continue to move to proceed.<br/>                                      <br><br/>
            When you are ready, press the  <b>SPACEBAR</b> to start.  </font></div>`,
    choices: ' ',
    post_trial_gap: 500,
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rating_choice_images = [];
  rating_choice_images_zero = [];

  ratings_images = jsPsych.randomization.shuffle(trial_options);
  var numbers = Array.from({ length: 100 }, (_, index) => index + 1);

  var ratings = {
    on_start: () => document.body.style.cursor = 'pointer',
    data: {
      screen_id: "ratings",
    },
    type: jsPsychImageSliderResponse,
    stimulus_height: 520, //320
    stimulus_width: 650, //450
    timeline: ratings_images.map(img => ({
      stimulus: img,
      slider_start: jsPsych.randomization.sampleWithoutReplacement(numbers, 1)
    })),
    labels: ['Not at all', 'Very much'],
    min: 1,
    max: 100,
    require_movement: true, //set to true for experiment
    slider_width: 1000,
    response_ends_trial: true,
    button_label: [`continue`],
    on_finish: (data) => {
      if (data.rating > 0) {
        rating_choice_images.push(data.stimulus);
      }
      if (data.rating >= 0) {
        rating_choice_images_zero.push(data.stimulus);
      }
    }
  };

// Choice task
var get_choice_images = function (image_paths) {
  // Number of trials to generate
  var numSets = 41; // Set to your desired number for the experiment
  // Maximum number of images per set (should be the largest alternative_size you'll use)
  var maxImagesPerSet = 12; // This ensures we have enough images for all conditions
  
  // Array to store the selected sets
  var selectedSets = [];
  // Create a counter object to track the usage of each image path
  var imagePathCounter = {};
  var maxUsageLimit = 25;
  
  // Generate the sets
  for (var i = 0; i < numSets; i++) {
      var selectedImages = [];
      var uniquePaths = [];
      var numAttempts = 0;
      
      // Always get maxImagesPerSet images - we'll subset later based on alternative_size
      while (uniquePaths.length < maxImagesPerSet && numAttempts < image_paths.length * 2) {
          var imagePath = jsPsych.randomization.sampleWithoutReplacement(image_paths, 1)[0];
          if (uniquePaths.indexOf(imagePath) === -1 && 
              (!imagePathCounter[imagePath] || imagePathCounter[imagePath] < maxUsageLimit)) {
              uniquePaths.push(imagePath);
              selectedImages.push(imagePath);
              imagePathCounter[imagePath] = (imagePathCounter[imagePath] || 0) + 1;
          }
          numAttempts++;
      }
      
      if (selectedImages.length === maxImagesPerSet) {
          selectedSets.push({
              options: selectedImages,
              originalOptions: [...selectedImages] // Keep a copy of all images
          });
      }
  }
  
  return selectedSets;
};

// Reuse the shuffleArray function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

// Function to initialize or reset originalOptions for each trial
function initializeOriginalOptions(trials) {
  trials.forEach(trial => {
  // Store a copy of the options array in originalOptions if not already present
    if (!trial.originalOptions) {
        trial.originalOptions = [...trial.options];
  } else {
        // Reset options to the original full set if originalOptions already exists
        trial.options = [...trial.originalOptions];
  }
  });
}

// Function to apply random selection to each trial's options, using originalOptions
function applyRandomSelectionToAllTrials(trials, subsetSize) {
  initializeOriginalOptions(trials); // Ensure originalOptions is set and options are reset to full set
  trials.forEach(trial => {
    shuffleArray(trial.originalOptions); // Shuffle the original options
    trial.options = trial.originalOptions.slice(0, subsetSize); // Create a subset from the shuffled original options
  });
}

var choice_trials = [0];

var stimulus_html = [
  //select 1
  `<div><br/><font size="120%" color="green">Food Preference: Choose One</font><br/>
  <br/>
  You will now select <b><font color="green">one</font></b> of the foods you'd most like to eat.<br/>
  <b>Before each trial:</b> You will be asked to click on the basket, indicating that you are ready to begin and that your mouse is in the center.<br/>
  <b>Do not move your mouse from the cart until you are presented with the items.</b><br/>
  As a reminder, you are choosing which foods you'd most like to eat: <br/>
  To select a food, simply click on it.<br/>

  <img height="450px" width="500px" src="${instruct_img[7]}"><br/>

  Once selected, the food will have an <b><font color="#FF7F00">orange</font></b> outline. <br/>
  <u><b>Once you select a food, you cannot deselect it.</b></u><br/>
  <br>
  <b>Importantly, once you select a food:</b> You will not be able to select another until you have clicked on your cart (added it).<br/>
  <b>After you click on the cart:</b> The cart will briefly have a <b><font color="#720e9e">purple</font></b> outline to indicate that your item was selected.<br/><br/>
  When you are ready, press the <b>SPACE BAR</b> to begin.</div>`,
  //condition 2
  `<div><br/><font size=120%; font color = 'green';>Food preference: Choose two</font><br/>
  <br/>
  You will now select <b><font color='green'>two</font></b> of the foods you'd most like to eat.<br/>
  <b>Before each trial:</b> You will be asked to click on the basket, indicating that you are ready to begin and that your mouse is in the center.<br/>
  <b>Do not move your mouse from the cart until you are presented with the items.</b><br/>
  As a reminder, you are choosing which foods you'd most like to eat: <br/>
  To select a food, simply click on it.<br/>

  <img height="450px" width="500px" src="${instruct_img[7]}"><br/>

  Once selected, the food will have an <b><font color="#FF7F00">orange</font></b> outline. <br/>
  <u><b>Once you select a food, you cannot deselect it.</b></u><br/>
  <br>
  <b>Importantly, once you select a food:</b> You will not be able to select another until you have clicked on your cart (added it).<br/>
  <b>After you click on the cart:</b> The cart will briefly have a <b><font color="#720e9e">purple</font></b> outline to indicate that your item was selected.<br/><br/>
  When you are ready, press the <b>SPACE BAR</b> to begin.</div>`,
  //condition 3
  `<div><br/><font size=120%; font color = 'green';>Food preference: Choose three</font><br/>
  <br/>
  You will now select <b><font color='green'>three</font></b> of the foods you'd most like to eat.<br/>
  <b>Before each trial:</b> You will be asked to click on the basket, indicating that you are ready to begin and that your mouse is in the center.<br/>
  <b>Do not move your mouse from the cart until you are presented with the items.</b><br/>
  As a reminder, you are choosing which foods you'd most like to eat: <br/>
  To select a food, simply click on it.<br/>

  <img height="450px" width="500px" src="${instruct_img[7]}"><br/>

  Once selected, the food will have an <b><font color="#FF7F00">orange</font></b> outline. <br/>
  <u><b>Once you select a food, you cannot deselect it.</b></u><br/>
  <br>
  <b>Importantly, once you select a food:</b> You will not be able to select another until you have clicked on your cart (added it).<br/>
  <b>After you click on the cart:</b> The cart will briefly have a <b><font color="#720e9e">purple</font></b> outline to indicate that your item was selected.<br/><br/>
  When you are ready, press the <b>SPACE BAR</b> to begin.</div>`,
];

var choiceInstruction_choose_one = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: stimulus_html[0],
  choices: ' ',
  post_trial_gap: 500
}
var choiceInstruction_choose_two = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: stimulus_html[1],
  choices: ' ',
  post_trial_gap: 500
}
var choiceInstruction_choose_three = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: stimulus_html[2],
  choices: ' ',
  post_trial_gap: 500
}

var trial_count = 0;

var break_screen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
      let nextSubsetSize = jsPsych.timelineVariable('subset_size');
      return `<div style="font-size: 24px; line-height: 1.6;">
          <p style="font-size: 48px; color: green; margin-bottom: 40px;">Break Time!</p>
          
          <p style="margin-bottom: 30px;">You can take a short break now.</p>
          
          <p style="margin-bottom: 20px;">In the next block, you will:</p>
          <p style="font-size: 36px; font-weight: bold; margin-bottom: 40px;">Choose ${nextSubsetSize}</p>
          
          <p>Press the <span style="font-weight: bold; font-size: 28px;">SPACE BAR</span> when you're ready to continue.</p>
      </div>`;
  },
  choices: [' '],
  post_trial_gap: 500
};

var start_trial = {
  on_start: () => document.body.style.cursor = 'pointer',
  data: { screen_id: "start_fixation" },
  type: jsPsychHtmlButtonResponse,
  stimulus: ' ',
  choices: ['Start Choosing'],
  button_html: '<button class="jspsych-btn" style="background-color: white; border: 5px solid purple; border-radius:50%; padding: 25px; display: inline-block; cursor: pointer;"><img src="' + instruct_img[6] + '" style="width:100px; height:100px;"></button>'
};
//task
var trial = {
  data: () => ({
      screen_id: 'trial',
      options: choice_trials[trial_count].options,
      set_size: jsPsych.timelineVariable('alternative_size'),
      subset_size: jsPsych.timelineVariable('subset_size'),
      trial_number: trial_count,
      block_number: Math.floor(trial_count / 40) + 1,
      total_trials: jsPsych.timelineVariable('total_trials')
    }),
  type: jsPsychVisualSearchCircle,
  num_required_responses: jsPsych.timelineVariable('subset_size'),
  stimuli: function() {
    // Get the current trial's full set of options
    let currentTrial = choice_trials[trial_count];
    // Take only the number of options specified by alternative_size
    return currentTrial.options.slice(0, jsPsych.timelineVariable('alternative_size'));
  },  
  fixation_image: instruct_img[6],
  target_present_key: ' ',
  target_absent_key: 'n',
  target_present: true,
  circle_diameter: 925, // Increased from 725
  fixation_size:[100,100],
  target_size: [200, 200], // Slightly reduced from 225 to help prevent overlap
  extensions: [
  {type: jsPsychExtensionMouseTracking, params: {targets: ['#fixation']}}
  ],
  on_finish: function (data) {
      var responses = JSON.parse(data.imgIds);
      // Count the number of responses
      var options_selected = responses.length;
      // Store the count back in the trial data
      data.options_selected = options_selected;
      // Increment trial count
      trial_count++;
      data.final_trial_count = trial_count;
  }
};

var ratings_procedure = {
    timeline: [exposure_instruction, exposure_sequence,ratingOverview,ratings],
};

   //make conditional timeline variable for eye tracking re-calibration
// var if_recalibrate = {
//     timeline: [recalibrate],
//     conditional_function: function(){
//       if (trial_count == choice_trials.length/2 - 1 || trial_count == 0){
//         return true;
//       } else {
//         return false;
//       }
//     }
// }
//   var task_timeline = {
// //    timeline: [fixation, trial],
//     timeline: [fixation, trial, if_recalibrate],
//     loop_function: function () {
//       if (trial_count < choice_trials.length - 1) {
//         return true;
//       } else {
//         trial_count = 0;
//         return false;
//       }
//     },
//   };
var current_total_trials = 0;

var trial_with_break = {
  timeline: [
      start_trial,
      trial,
      {
          timeline: [break_screen],
          conditional_function: function() {
              // Show break screen every 20 trials (but only if not at the end)
              return (trial_count % 10 === 0 && trial_count > 0 && trial_count < current_total_trials);
          }
      }
  ]
};

// var task_timeline = {
//   timeline: [start_trial, trial],
//   loop_function: function() {
//       if (trial_count < choice_trials.length - 1) {
//           return true;
//       } else {
//           trial_count = 0;
//           return false;
//       }
//   }
// };
var task_timeline = {
  timeline: [trial_with_break],
  loop_function: function(data) {
      // console.log('Current trial count in loop:', trial_count);
      // console.log('Current total trials target:', current_total_trials);
      if (trial_count >= current_total_trials) {
          // console.log('Reached target trials, resetting count');
          trial_count = 0;
          return false;
      }
      return true;
  },
  on_start: function() {
      current_total_trials = jsPsych.timelineVariable('total_trials');
      // console.log('Starting timeline, target trials:', current_total_trials);
  }
};

 //make conditional timeline variable for choice task instructions
 var if_choose_one = {
  timeline: [choiceInstruction_choose_one],
  conditional_function: function(){
    if (jsPsych.timelineVariable('subset_size') == 1){
      return true;
    } else {
      return false;
    }
  }
 }
 var if_choose_two = {
  timeline: [choiceInstruction_choose_two],
  conditional_function: function(){
    if (jsPsych.timelineVariable('subset_size') == 2){
      return true;
    } else {
      return false;
    }
  }
 }
 var if_choose_three = {
  timeline: [choiceInstruction_choose_three],
  conditional_function: function(){
    if (jsPsych.timelineVariable('subset_size') == 3){
      return true;
    } else {
      return false;
    }
  }
 }
//  var choose_k_procedure = {
//   on_start: function() {
//       choice_trials = get_choice_images(image_paths);
//   },
//   timeline: [
//       if_choose_one,
//       if_choose_two,
//       if_choose_three, 
//       task_timeline
//   ],
//   timeline_variables: [
//       { subset_size: 1, alternative_size: 4 },
//       { subset_size: 1, alternative_size: 8 },
//       { subset_size: 1, alternative_size: 12 },
//       { subset_size: 2, alternative_size: 4 },
//       { subset_size: 2, alternative_size: 8 },
//       { subset_size: 2, alternative_size: 12 },
//       { subset_size: 3, alternative_size: 4 },
//       { subset_size: 3, alternative_size: 8 },
//       { subset_size: 3, alternative_size: 12 }
//   ],
//   randomize_order: true
// };

var make_block_timeline_variables = function() {
  let base_conditions = [
//      { subset_size: 1, alternative_size: 4 },
//      { subset_size: 1, alternative_size: 8 },
//      { subset_size: 1, alternative_size: 12 },
//      { subset_size: 2, alternative_size: 4 },
//      { subset_size: 2, alternative_size: 8 },
//      { subset_size: 2, alternative_size: 12 },
//      { subset_size: 3, alternative_size: 4 },
//      { subset_size: 3, alternative_size: 8 },
      { subset_size: 3, alternative_size: 12 }
  ];

  // Create two blocks of 20 trials for each condition
  let all_blocks = [];
  base_conditions.forEach(condition => {
      // Add two blocks of 20 trials each for this condition
      all_blocks.push({
          ...condition,
          total_trials: 20,
          block_id: `${condition.subset_size}_${condition.alternative_size}_1`
      });
      all_blocks.push({
          ...condition,
          total_trials: 20,
          block_id: `${condition.subset_size}_${condition.alternative_size}_2`
      });
  });

  // Shuffle the blocks to randomize order
  return jsPsych.randomization.shuffle(all_blocks);
};


 var choose_k_procedure = {
  on_start: function() {
    choice_trials = get_choice_images(image_paths);
    trial_count = 0;
    current_total_trials = 0;
    // console.log('Starting new condition, trial count reset to:', trial_count);
},
  timeline: [
      if_choose_one,
      if_choose_two,
      if_choose_three, 
      task_timeline
  ],
  timeline_variables: make_block_timeline_variables(),
  randomize_order: false
};

var debrief = {
    type: jsPsychHtmlKeyboardResponse,
    on_start:   () => document.body.style.cursor = 'pointer',
    stimulus: `<div> <b><font size=100%; font color = 'green';>We have completed our experiment.</font></b><br/>
    <br><br/><b><font size=100%; font color = 'green';>Thank you for participating.</font></div>`,
    trial_duration: 600
};

var fullscreenEnd = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
    delay_after: 0
}

// timeline
var timeline = []

timeline.push(informed_consent);
timeline.push(welcome_block_Prolific); //for prolific specific data collection
timeline.push(fullscreenEnter); //start the fullscreen
timeline.push(preload);
timeline.push(instruction_block_1);

//eye tracking
// timeline.push(eyeTrackingInstruction1);
// timeline.push(eyeTrackingInstruction2);
// timeline.push(eyeTrackingNote);
// timeline.push(camera_instructions);
// timeline.push(init_camera);
// timeline.push(calibration_instructions);
// timeline.push(calibration);
// timeline.push(validation_instructions);
// timeline.push(validation);
// timeline.push(recalibrate);
// timeline.push(calibration_done);

//task
timeline.push(ratings_procedure);
// timeline.push(recalibrate);
// timeline.push(calibration_done);
timeline.push(choose_k_procedure);
timeline.push(fullscreenEnd); //end the fullscreen
timeline.push(debrief);

//Start Experiment
jsPsych.run(timeline);
