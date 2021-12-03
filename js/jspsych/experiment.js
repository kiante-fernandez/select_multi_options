var jsPsych = initJsPsych({
    on_finish: function () {
        var csv = jsPsych.data.get().csv();
        var filename = jsPsych.data.get().values()[0].subject_id + "_" + DATE + ".csv";;
        downloadCSV(csv,filename);
        jsPsych.data.displayData()
    }
}
);

// CONSTANTS
var TODAY = new Date();
var DD = String(TODAY.getDate()).padStart(2, '0');
var MM = String(TODAY.getMonth() + 1).padStart(2, '0');
var YYYY = TODAY.getFullYear();
const DATE = YYYY + MM + DD;

//Creating list of image paths to load.
//These are image paths to images for the experimental treatment shown on each trial
var image_indices_lst = math.range(1, 80); //math.range() returns a js obj that has a parameter called '._data' and that has an Array of the range.

image_indices_lst = Array.from(image_indices_lst._data); // This is just a list containing the range of numbers used for each url of the
// experimental stimulus. The experimental stimuli are all saved in the /img/food/ folder. They have a prefix "food"
// and then they include the number 1-N for N number of trials.
var arrayLength = image_indices_lst.length; // arrayLength is used to show how many images/trials there are from 1-N trials.
var image_paths = [];
for (var i = 0; i < arrayLength; i++) {
    // This for loop fills the image_paths list with urls to the images for each of the experimental treatments
    var path_str1 = "img/food/food" + String(image_indices_lst[i]) + ".jpg";
    image_paths.push(path_str1);
}
// Randomly select a subset of images
const shuffled_image_names = jsPsych.randomization.shuffle(image_paths);
// Get the img paths for the selected images
const trial_options = shuffled_image_names.slice(0, 15);

// Preloading files are needed to present the stimuli accurately.
const preload = {
    type: jsPsychPreload,
    images: image_paths,
}

// Welcome
var welcome_block = {
    data: {
        screen_id: "welcome"
    },
    type: jsPsychSurveyHtmlForm,
    preamble: "<p>Welcome to the experiment!</p>"+
    "Please complete the form",
    html: "<p>Participant ID: <input name = 'subject_id' type = 'text'/></p>",
    on_finish: function(data) {
        responses = data.response;
        jsPsych.data.addProperties({
            subject_id: responses.subject_id,
            ID_DATE: responses.subject_id + "_" + DATE,
        })
    }
};

// Instructions I
var instruction_block_1 = {
    data: {screen_id: "instructions"},
    type: jsPsychInstructions,
    pages: [
        '<p>Welcome to the study!</p>' +
        "<p>Today, you will make some decisions about food items. </p>" +
        "<p>Please pay attention to the instructions. For part of the study, your eye movements will be tracked.</p>"+
        "<p>If you have any questions, please ask the experimenter at this time. If you are ready to begin, please press the enter key.</p>",
    ],
    key_forward: ' '
};
// Calibration eye tracking


// Experiment instructions
// here we need to choose one of two frames randomly. Then we need to show the approptirate text.
var condition_instructions = [
    //condition 1
    "<p>You have been selected to buy a box of snacks. Each item costs its normal price.</p>" +
    "<p>All the items available to buy are in your box.</p>" +
    "<p>Click on all the items you want to keep in your box.</p>"+
    "<p>Once you select an item, you cannot deselect it.</p>"+
    "<p>You will have a chance to receive each item that you selected.</p>"+
    "<p>When you’re finished selecting items, press the space bar to finalize your selection.</p>"+
    "<p>If you are ready to begin, please press the space bar.</p>",
    //condition 2
    "<p>You have been selected to buy a box of snacks. Each item costs its normal price.</p>" +
    "<p>All the items available to buy will be shown.</p>" +
    "<p>Click on all the items you want to add to your box.</p>"+
    "<p>Once you select an item, you cannot deselect it.</p>"+
    "<p>You will have a chance to receive each item that you selected.</p>"+
    "<p>When you’re finished selecting items, press the space bar to finalize your selection.</p>"+
    "<p>If you are ready to begin, please press the space bar.</p>"
];
//randomly select a condition
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};
const condition_choice = getRandomInt(2);
// expected output: 0, 1

//we need to get some indicator that tells us what conditoin this was
var instruction_block_2 = {
    data: {screen_id: "framing", condition: condition_choice},
    type: jsPsychInstructions,
    pages: [condition_instructions[condition_choice]
],
key_forward: ' '
};
//choice task
var fixation = {
    data: {screen_id: "fixation", stimulus: "fixation"},
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='font-size: 60px'>+</div>",
    trial_duration: [500],
    response_ends_trial: false
};
var trial = {
    data: {
        screen_id: "trial",
        options: trial_options
    },
    type: jsPsychMutipleButtonResponse,
    stimulus: [],
    prompt: [],
    choices: [shuffled_image_names[0],
    shuffled_image_names[1],
    shuffled_image_names[2],
    shuffled_image_names[3],
    shuffled_image_names[4],
    shuffled_image_names[5],
    shuffled_image_names[6],
    shuffled_image_names[7],
    shuffled_image_names[8],
    shuffled_image_names[9],
    shuffled_image_names[10],
    shuffled_image_names[11],
    shuffled_image_names[12],
    shuffled_image_names[13],
    shuffled_image_names[14]
],
button_html: [
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-0">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-1">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-2">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-3">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-4">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-5">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-6">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-7">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-8">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-9">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-10">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-11">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-12">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-13">',
    '<img src="%choice%" style="width:128px;height:128px;display:table;", id="jspsych-html-button-response-button-14">'                    ],
    response_ends_trial: true,
    keys: ' ',
    margin_vertical: "40px",
    margin_horizontal: "50px",
    on_finish: function(data) {
        //count how many options where selected
        //count how many objects in the res_buttons arrary.
        //Its a string, so extract the numbers then count
        matches = data.res_buttons.match(/\d+/g);
        data.options_selected = matches.length
    }
};
// Debrief
//we need to randomly select if this subject actully gets the foods or not
var Debrief = {
    data: {
        screen_id: "Debrief"
    },
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>You have completed the experiment.</p>" +
    "<p>please contact the experimenter.</p>",
    choices: ' ',
    response_ends_trial: true
};

var trials_with_variables = {
    timeline: [fixation, trial],
};
// timeline
var timeline = []

timeline.push(preload);
timeline.push(welcome_block);
timeline.push(instruction_block_1);
timeline.push(instruction_block_2);
timeline.push(trials_with_variables);
timeline.push(Debrief);

//Start Experiment
jsPsych.run(timeline);
