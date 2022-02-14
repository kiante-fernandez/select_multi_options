var jsPsych = initJsPsych({
    extensions: [
        {type: jsPsychExtensionWebgazer}
    ],
    on_finish: function () {
        $.ajax({
            type: "POST",
            url: "/experiment-data",
            data: JSON.stringify(jsPsych.data.get().values()),
            contentType: "application/json"
        }).done(function() {
            window.location.href = "finish";
            alert("Data has been saved!");
            // var csv = jsPsych.data.get().csv();
            // var filename = jsPsych.data.get().values()[0].subject_id + "_" + DATE + ".csv";
            // downloadCSV(csv,filename);
        }).fail(function() {
            alert("Problem occurred while writing data to Dropbox. " +
                "Data will be saved to your computer. " +
                "Please contact the experimenter regarding this issue!");
        var csv = jsPsych.data.get().csv();
        var filename = jsPsych.data.get().values()[0].subject_id + "_" + DATE + ".csv";
        downloadCSV(csv,filename);
        window.location.href = "finish";
    });
    closeFullscreen()
    // jsPsych.data.displayData()
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
const nImageInst = 5;
/** load all the instruction images, and remember to preload */
var instruct_img = [];
for (var i = 0; i < nImageInst; i++) {
  instruct_img.push('../../img/instruct' + i + '.png');
}
//Creating list of image paths to load for practice trials.

//Practice trials: animals
//These are image paths to images for the practice trials
var image_indices_2st = math.range(1, 16); //math.range() returns a js obj that has a parameter called '._data' and that has an Array of the range.
image_indices_2st = Array.from(image_indices_2st._data); // This is just a list containing the range of numbers used for each url of the
// praciice stimulus. The praciice stimuli are all saved in the /img/animal/ folder. They have a prefix "animal"
// and then they include the number 1-N for N number of trials.
var arrayLength_prac = image_indices_2st.length; // arrayLength is used to show how many images/trials there are from 1-N trials.
var image_paths_practice = [];
for (var i = 0; i < arrayLength_prac; i++) {
    // This for loop fills the image_paths list with urls to the images for each of the experimental treatments
    var path_str2 = "../../img/animal/animal" + String(image_indices_2st[i]) + ".jpg";
    image_paths_practice.push(path_str2);
}
//Practice trials: landmarks
//These are image paths to images for the practice trials
var image_indices_3rd = math.range(1, 16); //math.range() returns a js obj that has a parameter called '._data' and that has an Array of the range.
image_indices_3rd = Array.from(image_indices_3rd._data); // This is just a list containing the range of numbers used for each url of the
// praciice stimulus. The praciice stimuli are all saved in the /img/animal/ folder. They have a prefix "animal"
// and then they include the number 1-N for N number of trials.
var arrayLength_prac = image_indices_3rd.length; // arrayLength is used to show how many images/trials there are from 1-N trials.
var image_paths_practice2 = [];
for (var i = 0; i < arrayLength_prac; i++) {
    // This for loop fills the image_paths list with urls to the images for each of the experimental treatments
    var path_str3 = "../../img/landmark/landmark" + String(image_indices_3rd[i]) + ".jpg";
    image_paths_practice2.push(path_str3);
}

//These are image paths to images for the experimental treatment shown on each trial
var image_indices_lst = math.range(1, 80); //math.range() returns a js obj that has a parameter called '._data' and that has an Array of the range.

image_indices_lst = Array.from(image_indices_lst._data); // This is just a list containing the range of numbers used for each url of the
// experimental stimulus. The experimental stimuli are all saved in the /img/food/ folder. They have a prefix "food"
// and then they include the number 1-N for N number of trials.
var arrayLength = image_indices_lst.length; // arrayLength is used to show how many images/trials there are from 1-N trials.
var image_paths = [];
for (var i = 0; i < arrayLength; i++) {
    //"../../public/img/food/food" when not on local server
    // This for loop fills the image_paths list with urls to the images for each of the experimental treatments
    var path_str1 = "../../img/food/food" + String(image_indices_lst[i]) + ".jpg";
    image_paths.push(path_str1);
}

// Randomly select a subset of images
const shuffled_image_names = jsPsych.randomization.shuffle(image_paths);
// Get the img paths for the selected images
const trial_options = shuffled_image_names.slice(0, 15);

// Preloading files are needed to present the stimuli accurately.
const preload = {
    type: jsPsychPreload,
    images: [instruct_img,image_paths_practice, image_paths_practice2, image_paths],   //  preload just the images
}

// Brower Check (no need?)

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
var welcome_block = {
    data: {
        screen_id: "welcome"
    },
    type: jsPsychSurveyHtmlForm,
    preamble: "<p>Welcome to the experiment!</p>"+
    "Please complete the form",
    html: "<p>Participant ID: <input name = 'subject_id' type = 'text'/></p><p>OSU EMAIL: <input name = 'subject_email' type = 'text'/></p>",
    on_finish: function(data) {
        responses = data.response;
        jsPsych.data.addProperties({
            subject_id: responses.subject_id,
            subject_email: responses.subject_email,
            ID_DATE: responses.subject_id + "_" + DATE,
            browser_name: bowser.name,
            browser_type: bowser.version,
            windowWidth: $(window).width(),
            windowHight: $(window).height()
        })
    }
};

// Instructions I
var instruction_block_1 = {
    data: {screen_id: "instructions"},
    type: jsPsychInstructions,
    pages: [
        '<p>Welcome to the study!</p>' +
        "<p>Today, you will make some decisions about snack food items. </p>" +
        "<p>Please pay attention to the instructions. For part of the study, your eye movements will be tracked.</p>"+
        "<p>If you have any questions, please contact the experimenter at neuroeconomics.osu@gmail.com. If you are ready to begin, please press the SPACEBAR.</p>",
    ],
    key_forward: ' '
};
// EYE TRACKING
// eye instructions
var camera_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>In order to participate you must allow the experiment to use your camera.</p>
    <p>You will be prompted to do this on the next screen.</p>
    <p>If you do not wish to allow use of your camera, you cannot participate in this experiment.<p>
    <p>It may take up to 30 seconds for the camera to initialize after you give permission.</p>
    `,
    choices: ['Got it'],
}
var eyeTrackingInstruction1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div> <font size=120%; font color = 'green';>Calibration & Validation </font><br/>
                                             <br><br/>
                Before we begin with the study, we need to turn on and adjust your webcam for eye-tracking.   <br/>

                There are two parts to this process. The first part is calibration and the second part is validation.<br/>
                <br><br/>
                During calibration, you will see a series of dots like this: <img height="25px" width="30px" src="${instruct_img[4]}"> appear on the screen, each for 3 seconds.<br/>
                Your task is simply to stare directly at each dot until it disappears.<br/>
                Then, quickly move your eyes to the next dot and repeat.<br/>
                <br><br/>
                Validation is basically the same as calibration. You simply need to stare at each dot until it turns disappears.<br/>
                <br><br/>
                When you are ready, press the SPACEBAR to continue. </div>`,
  post_trial_gap: 500,
  choices: ' ',

}

var eyeTrackingInstruction2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div><font size=120%; font color = 'green';>Calibration & Validation </font><br/>
                                                                          <br><br/>
      When the calibration begins, you will see a video feed with your face at the top of your screen like this:  <br/>
        <br><br/>
         <img height="220px" width="270px" src="${instruct_img[0]}"><br/>
       <br><br/>
                         Try to keep your entire face within the box. When your face is in a good position, the box will turn <b><font color='green'>green</font></b>. <br/>
                         <font size=5px; font color = 'red';> <b>NOTE</b>: the video feed only appears during calibration.</font><br/>
                         <br><br/>
                         <font size=5px; >When you are ready, press the  <b>SPACEBAR</b> to continue.</font>

                         </div>`,
  post_trial_gap: 500,
  choices: ' ',

}

var eyeTrackingNote = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div><font size=120%; font color = 'green';> Calibration & Validation</font><br/>
                                                                          <br><br/>
             <font size = 5px font color = "yellow">There are several <b>IMPORTANT</b> tips that are useful for passing the calibration task:<br/></font>
             <img height="200px" width="1000px" src="${instruct_img[1]}"><br/>
             <br><br/>
             <div style="text-align-last:left">
            In addition to the tips in the figure: <br/>
            (1). Use your eyes to look around the screen and try to avoid moving your head. <br/>
            (2). Try to keep lights in front of you rather than behind you so that the webcam can clearly see your face. Avoid sitting with a window behind you. <br/>
            (3). After you have made these adjustments, check again that your face fits nicely within the box on the video feed and that the box is green. <br/></div>
             <br><br/>
             <font size=5px; font color = 'red';> <b>NOTE</b>:  <br/>
            If you are seeing this page for a 2nd time, it means the calibration and validation did not work as well as we would like.  <br/>
            Please read the tips above again, make any adjustments, and try again.  <br/>
            There are only <b>TWO</b> chances to get this right.  <br/>
            Otherwise, the study cannot proceed.  </font><br/>
            <br><br/>
             <font size=5px; >When you are ready, press the <b>SPACEBAR</b> to bring up the video feed and make these adjustments. </font></div>`,
  post_trial_gap: 500,
  choices: ' ',
}
// initialize eye tracker
var init_camera = {
    type: jsPsychWebgazerInitCamera
}
// Calibration eye tracking
var calibration_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Now lets start the calibration.</p>
    <p>You'll see a series of dots appear on the screen. Look at each dot.</p>
  `,
  choices: ['Got it'],
}
var calibration = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: [
        [25,25],[75,25],[50,50],[25,75],[75,75]
    ],
    repetitions_per_point: 2,
    randomize_calibration_order: true,
    calibration_mode: "view" //if view they look at points, if click they have to click on them
}
// validation eye tracking
var validation_instructions = {
 type: jsPsychHtmlButtonResponse,
 stimulus: `
   <p>Now we'll measure the accuracy of the calibration.</p>
   <p>Look at each dot as it appears on the screen.</p>
     `,
 choices: ['Got it'],
 post_trial_gap: 1000
}
var validation = {
    type: jsPsychWebgazerValidate,
    validation_points: [
        [25,25],[75,25],[50,50],[25,75],[75,75]
    ],
    roi_radius: 200,
    time_to_saccade: 1000,
    validation_duration: 2000,
    data: {
        task: 'validate'
    }
}
// recalibrate eye tracking
var recalibrate_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>The accuracy of the calibration is a little lower than we'd like.</p>
    <p>Let's try calibrating one more time.</p>
    <p>On the next screen, look at the dots.<p>
    `,
    choices: ['OK'],
}
var recalibrate = {
    timeline: [recalibrate_instructions, calibration, validation_instructions, validation],
    conditional_function: function(){
        var validation_data = jsPsych.data.get().filter({task: 'validate'}).values()[0];
        return validation_data.percent_in_roi.some(function(x){
            var minimum_percent_acceptable = 80; //what is the least acceptable amount?
            return x < minimum_percent_acceptable;
        });
    },
    data: {
        phase: 'recalibration'
    }
}
var calibration_done = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Great, we're done with calibration!</p>
    `,
    choices: ['OK']
}
//practice trials
//practice instructions
var practice_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div><font size=120%; font color = 'green';> Practice</font><br/>
             <br><br/>
             <div style="text-align-last:center">
            In this practice round you will be making choices about animals. You will see several animals on the screen.<br/>
            Your task is to select all the animals that are mammals.<br/>
            To select an animal, move your mouse to that animal and click it. A selected animal will have a <b><font color=#FF7F00>Orange</font></b> outline. <br/>
             <u><b>Once you select an animal, you cannot unselect it.</b> </u><br/>
            When you’re finished selecting animals, press the SPACEBAR to finalize your selection.
            <br><br/>
             <font size=5px; >When you are ready, press the <b>SPACEBAR</b> to begin</font></div>`,
  post_trial_gap: 500,
  choices: ' ',
}
//practice trial
var practice_trial = {
    data: {
        screen_id: "practice_trial",
        options: trial_options
    },
    type: jsPsychMutipleButtonResponse,
    stimulus: [],
    prompt: ['<b>select all the animals which are mammals</b>'],
    choices: [image_paths_practice[0],
    image_paths_practice[1],
    image_paths_practice[2],
    image_paths_practice[3],
    image_paths_practice[4],
    image_paths_practice[5],
    image_paths_practice[6],
    image_paths_practice[7],
    image_paths_practice[8],
    image_paths_practice[9],
    image_paths_practice[10],
    image_paths_practice[11],
    image_paths_practice[12],
    image_paths_practice[13],
    image_paths_practice[14]
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
//practice instructions
var practice_instructions_2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div><font size=120%; font color = 'green';> Practice</font><br/>
             <br><br/>
             <div style="text-align-last:center">
            In this practice round you will be making choices about monuments. You will see several monuments on the screen.<br/>
            Your task is to select all the monuments you would like to vist.<br/>
             <u><b>Once you select an monument, you cannot unselect it.</b> </u><br/>
            When you’re finished selecting monuments, press the SPACEBAR to finalize your selection.
            <br><br/>
             <font size=5px; >When you are ready, press the <b>SPACEBAR</b> to begin</font></div>`,
  post_trial_gap: 500,
  choices: ' ',
}
var practice_trial_2 = {
    data: {
        screen_id: "practice_trial",
        options: trial_options
    },
    type: jsPsychMutipleButtonResponse,
    stimulus: [],
    prompt: [],
    choices: [image_paths_practice2[0],
    image_paths_practice2[1],
    image_paths_practice2[2],
    image_paths_practice2[3],
    image_paths_practice2[4],
    image_paths_practice2[5],
    image_paths_practice2[6],
    image_paths_practice2[7],
    image_paths_practice2[8],
    image_paths_practice2[9],
    image_paths_practice2[10],
    image_paths_practice2[11],
    image_paths_practice2[12],
    image_paths_practice2[13],
    image_paths_practice2[14]
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
// here do we want to include a recalibration?

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

// here we need to choose one of two frames randomly. Then we need to show the approptirate text.
//what should the values for the discont be? should it be probabalistics?
var condition_instructions = [
    //condition 1
    "<p>In this part of the study you will be making choices about snack food items.</p>" +
    "<p>You have the opportunity to purchase some snack foods. To do so, you have been provided with a bonus payment of <u><b>$15.</b></u> </p> " +
    "<p>Each snack is discounted from its normal price by 50% to $1. Any money that you don’t spend on the snacks is yours to keep.</p>" +
    "<p>We have preloaded all the available snack foods into your cart.</p>" +
    "<p>Your task is to click on all the snacks that you want to keep in your cart.</p>"+
    "<p><b>Once you select a snack, you cannot unselect it.</b></p>"+
    "<p>When you’re finished selecting snacks, press the SPACEBAR to finalize your selection.</p>"+
    "<p>At the end of the study there is a XX% chance that you will be selected for payment.</p>"+
    "<p>In that case, you will receive all of the snacks that you selected and pay the price of those snacks from your bonus payment. You will receive the rest of the bonus payment in cash.</p>"+
    "<p>If you are ready to begin, please press the SPACEBAR.</p>",
    //condition 2
    "<p>In this part of the study you will be making choices about snack food items.</p>" +
    "<p>You have the opportunity to purchase some snack foods To do so, you have been provided with a bonus payment of <u><b>$15.</b></u></p>"+
    "<p>Each snack is discounted from its normal price by 50% to $1. Any money that you don’t spend on the snacks is yours to keep.</p>" +
    "<p>All the available snack foods will be displayed on the screen.</p>" +
    "<p>Your task is to click on all the snacks that you want to add to your cart.</p>"+
    "<p><b>Once you select a snack, you cannot unselect it.</b></p>"+
    "<p>When you’re finished selecting snacks, press the SPACEBAR to finalize your selection.</p>"+
    "<p>At the end of the study there is a XX% chance that you will be selected for payment. </p>"+
    "<p>In that case, you will receive all of the snacks that you selected and pay the price of those snacks from your bonus payment. You will receive the rest of the bonus payment in cash.</p>"+
    "<p>If you are ready to begin, please press the SPACEBAR.</p>"
];

const condition_choice = getRandomInt(0,1);
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
    },
    extensions: [
        {
            type: jsPsychExtensionWebgazer,
            params: {
                targets:
                ['#jspsych-multiple-select-response-button-0',
                '#jspsych-multiple-select-response-button-1',
                '#jspsych-multiple-select-response-button-2',
                '#jspsych-multiple-select-response-button-3',
                '#jspsych-multiple-select-response-button-4',
                '#jspsych-multiple-select-response-button-5',
                '#jspsych-multiple-select-response-button-6',
                '#jspsych-multiple-select-response-button-7',
                '#jspsych-multiple-select-response-button-8',
                '#jspsych-multiple-select-response-button-9',
                '#jspsych-multiple-select-response-button-10',
                '#jspsych-multiple-select-response-button-11',
                '#jspsych-multiple-select-response-button-12',
                '#jspsych-multiple-select-response-button-13',
                '#jspsych-multiple-select-response-button-14'
            ]}
        }
    ]
};
// get ratings //
var ratingOverview = {
  type: jsPsychHtmlKeyboardResponse,
  on_start:   () => document.body.style.cursor = 'pointer',
  stimulus: `<div> <font size=120%; font color = 'green';>Rating task</font><br/>
                                       <br><br/>
             Now, you will make decisions about each snack food one by one. <br/>
             For each snack food, please rate it on a scale from 0 to 10 based on how much you would like to eat this food right now.<br/>
             A 0 means that you would neither like nor dislike to eat this food.  <br/>
             When choosing whether to eat this food or not, you would be willing to flip a coin.   <br/>
             A 10 means that you would really love to eat this food. <br/>
             If you dislike a food and would not want to eat it, then click DISLIKE. <br/>
             During the task, you need to use your mouse to move the slider to your desired rating. <br/>
                                          <br><br/>
            When you are ready, press the  <b>SPACEBAR</b> to start.  </div>`,
  choices: ' ',
  post_trial_gap: 500,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
rating_choice_images = [];
rating_choice_images_zero = [];

ratings_images = jsPsych.randomization.shuffle(trial_options);
var ratings = {
    data:{
        screen_id:"ratings",
    },
  type: jsPsychImageSliderResponse,
  stimulus_height: 320,
  stimulus_width: 450,
  timeline: ratings_images.map(img => ({
    stimulus: img
  })),
  labels: ['0', '1', '2', '3', '4', '5','6','7','8','9','10'],
  min: 0,
  max: 10,
  slider_start: 0,
  require_movement: true,
  slider_width: 900,
  response_ends_trial: true,
  button_label: [],
  on_finish: (data) => {
    if (data.rating > 0) {
      rating_choice_images.push(data.stimulus);
    }
    if (data.rating >= 0) {
      rating_choice_images_zero.push(data.stimulus);
    }
  }
};

// Debrief
//we need to randomly select if this subject actully gets the foods or not
var debrief = {
    data: {
        screen_id: "debrief"
    },
    type: jsPsychInstructions,
    pages: [
        "<p>We have completed our experiment. </p>" +
        "<p>Please press next.</p>"
    ],
    show_clickable_nav: true,
};

var trials_with_variables = {
    timeline: [practice_instructions, fixation, practice_trial, practice_instructions_2, fixation, practice_trial_2, exp_start_instructions, instruction_block_2, fixation, trial, ratingOverview, ratings],
};

// timeline
var timeline = []

timeline.push(informed_consent);
timeline.push(fullscreenEnter); //start the fullscreen
timeline.push(preload);
timeline.push(welcome_block);
timeline.push(instruction_block_1);
timeline.push(eyeTrackingInstruction1);
timeline.push(eyeTrackingInstruction2);
timeline.push(eyeTrackingNote);
timeline.push(camera_instructions);
timeline.push(init_camera);
timeline.push(calibration_instructions);
timeline.push(calibration);
timeline.push(validation_instructions);
timeline.push(validation);
timeline.push(recalibrate);
timeline.push(calibration_done);
timeline.push(trials_with_variables);
timeline.push(debrief);

//Start Experiment
jsPsych.run(timeline);
