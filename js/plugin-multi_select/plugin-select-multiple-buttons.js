var jsPsychMutipleButtonResponse = (function (jspsych) {
  "use strict";
  const info = {
      name: "select-multiple-buttons",
      parameters: {
          /** The HTML string to be displayed */
          stimulus: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Stimulus",
              default: undefined,
          },
          /** Array containing the label(s) for the button(s). */
          choices: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Choices",
              default: undefined,
              array: true,
          },
          /** Array containing the key(s) the subject is allowed to press to respond to the stimulus.
          */
         keys: {
             type: jspsych.ParameterType.KEYS,
             pretty_name: "keys",
             default: "ALL_KEYS",
             array: true,
         },
          /** The HTML for creating button. Can create own style. Use the "%choice%" string to indicate where the label from the choices parameter should be inserted. */
          button_html: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Button HTML",
              default: '<button class="jspsych-btn">%choice%</button>',
              array: true,
          },
          /** Any content here will be displayed under the button(s). */
          prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Prompt",
              default: null,
          },
          /** How long to show the stimulus. */
          stimulus_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Stimulus duration",
              default: null,
          },
          /** How long to show the trial. */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
          /** The vertical margin of the button. */
          margin_vertical: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Margin vertical",
              default: "0px",
          },
          /** The horizontal margin of the button. */
          margin_horizontal: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Margin horizontal",
              default: "8px",
          },
          /** If true, then trial will end when user responds. */
          response_ends_trial: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Response ends trial",
              default: true,
          },
        /** The number of unique key presses required to end the trial. */
        num_required_responses: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Number of required responses",
        default: 1,
      }
    }
  };
  /**
   * **select_multi_options**
   *
   * jsPsych plugin for displaying a set of stimulus and getting multipe button responses, and
   * then ending the trial with a key press
   *
   * @author Kianté Fernandez
   * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
   */
  class MutipleButtonResponse {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
        // display stimulus
        var html = '<div id="jspsych-multiple-select-response-stimulus">' + trial.stimulus + "</div>";
        //display buttons
        var buttons = [];
        var choice_keys = trial.keys;

        if (Array.isArray(trial.button_html)) {
            if (trial.button_html.length == trial.choices.length) {
                buttons = trial.button_html;
            }
            else {
                console.error("Error in multiple-select-response-buttons plugin. The length of the button_html array does not equal the length of the choices array");
            }
        }
        else {
            for (var i = 0; i < trial.choices.length; i++) {
                buttons.push(trial.button_html);
            }
        }
        html += '<div id="jspsych-multiple-select-response-btngroup">';
        for (var i = 0; i < trial.choices.length; i++) {
            var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
            html +=
                '<div class="jspsych-multiple-select-response-button" style="display: inline-block; margin:' +
                    trial.margin_vertical +
                    " " +
                    trial.margin_horizontal +
                    '" id="jspsych-multiple-select-response-button-' +
                    choice_keys[i] +
                    '" data-choice="' +
                    choice_keys[i] +
                    '">' +
                    str +
                    "</div>";
        }
        html += "</div>";
        //show prompt if there is one
        if (trial.prompt !== null) {
            html += trial.prompt;
        }
        display_element.innerHTML = html;

        // store response
        var response = {
            key: [],
        };
        var rt = [];
        var res_buttons = [];
        var counter = 0;

        // start time
        var start_time = performance.now();

        // function to handle responses by the subject
        function after_response(info) {
            // only record the key if it's not already been pressed. 
            //Check if key has already been pressed by comparing to the response.key array
            if (response.key.indexOf(info.key) == -1) {
                var btn_el = display_element.querySelector("#jspsych-multiple-select-response-button-" + info.key);
                $(btn_el).toggleClass("active");
                var choice = btn_el.getAttribute("data-choice"); // don't use dataset for jsdom compatibility
                // measure rt
                var end_time = performance.now();
                var rt_button = Math.round(end_time - start_time);
                res_buttons.push(choice_keys.indexOf(choice));
                rt.push(rt_button);
                response.key.push(info.key);
            // after a valid response, the stimulus will have the CSS class 'responded'
            // which can be used to provide visual feedback that a response was recorded
                display_element.querySelector("#jspsych-multiple-select-response-stimulus").className += " responded";
                ending_the_trial(info);
            }
        }
        // function to end the trial
        function ending_the_trial(info){
            counter++;  
            if (counter >= trial.num_required_responses) {
                // wait for 100 ms before running the end trial function (this is so that the user can see the last button press)
                setTimeout(function () {
                    end_trial();
                  },50)
                }        
            }

        // start the response listener
        if (trial.keys != "NO_KEYS") {
            var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: after_response,
                valid_responses: trial.keys,
                rt_method: "performance",
                persist: true,
                allow_held_key: false,
            });
        }
        // function to end trial when it is time
        const end_trial = () => {
                    // kill any remaining setTimeout handlers
                    this.jsPsych.pluginAPI.clearAllTimeouts();
                    // kill keyboard listeners
                    if (typeof keyboardListener !== "undefined") {
                        this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                    }
                    // gather the data to store for the trial
                    var trial_data = {
                        stimulus: trial.choices,
                        rt: JSON.stringify(rt),
                        key_press: JSON.stringify(response.key),
                        res_buttons: JSON.stringify(res_buttons)
                    };
                        
                    // clear the display
                    display_element.innerHTML = "";
                    // move on to the next trial
                    this.jsPsych.finishTrial(trial_data);
                };

        // hide image if timing is set
        if (trial.stimulus_duration !== null) {
            this.jsPsych.pluginAPI.setTimeout(() => {
                display_element.querySelector("#jspsych-multiple-select-response-stimulus").style.visibility = "hidden";
            }, trial.stimulus_duration);
        }
        // end trial if time limit is set
        if (trial.trial_duration !== null) {
            this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
        }
    }
}
MutipleButtonResponse.info = info;

 return MutipleButtonResponse;
})(jsPsychModule);
