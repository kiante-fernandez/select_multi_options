var jsPsychVisualSearchCircle = (function (jspsych) {
  'use strict';

  const info = {
      name: "visual-search-circle",
      parameters: {
          /** The target image to be displayed. This must specified when using the target, foil and set_size parameters to define the stimuli set, rather than the stimuli parameter. */
          target: {
              type: jspsych.ParameterType.IMAGE,
              pretty_name: "Target",
              default: null,
          },
          /** The image to use as the foil/distractor. This must specified when using the target, foil and set_size parameters to define the stimuli set, rather than the stimuli parameter. */
          foil: {
              type: jspsych.ParameterType.IMAGE,
              pretty_name: "Foil",
              default: null,
          },
          /** How many items should be displayed, including the target when target_present is true? This must specified when using the target, foil and set_size parameters to define the stimuli set, rather than the stimuli parameter. */
          set_size: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Set size",
              default: null,
          },
          /** Array containing one or more image files to be displayed. This only needs to be specified when NOT using the target, foil, and set_size parameters to define the stimuli set. */
          stimuli: {
              type: jspsych.ParameterType.IMAGE,
              pretty_name: "Stimuli",
              default: null,
              array: true,
          },
          /**
           * Is the target present?
           * When using the target, foil and set_size parameters, false means that the foil image will be repeated up to the set_size,
           * and if true, then the target will be presented along with the foil image repeated up to set_size - 1.
           * When using the stimuli parameter, this parameter is only used to determine the response accuracy.
           */
          target_present: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Target present",
              default: undefined,
          },
          /** Path to image file that is a fixation target. */
          fixation_image: {
              type: jspsych.ParameterType.IMAGE,
              pretty_name: "Fixation image",
              default: undefined,
          },
          /** Two element array indicating the height and width of the search array element images. */
          target_size: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Target size",
              array: true,
              default: [50, 50],
          },
          /** Two element array indicating the height and width of the fixation image. */
          fixation_size: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Fixation size",
              array: true,
              default: [16, 16],
          },
          /** The diameter of the search array circle in pixels. */
          circle_diameter: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Circle diameter",
              default: 250,
          },
          /** The key to press if the target is present in the search array. */
          target_present_key: {
              type: jspsych.ParameterType.KEY,
              pretty_name: "Target present key",
              default: "j",
          },
          /** The key to press if the target is not present in the search array. */
          target_absent_key: {
              type: jspsych.ParameterType.KEY,
              pretty_name: "Target absent key",
              default: "f",
          },
          /** The maximum duration to wait for a response. */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
          /** How long to show the fixation image for before the search array (in milliseconds). */
          fixation_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Fixation duration",
              default: 25,
          },
        /** The number of unique item selections required to end the trial. */
          num_required_responses: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Number of required responses",
              default: 2,
          }
      },
  };
  /**
   * **visual-search-circle**
   *
   * jsPsych plugin to display a set of objects, with or without a target, equidistant from fixation.
   * Subject responds with key press to whether or not the target is present.
   * Based on code written for psychtoolbox by Ben Motz.
   *
   * @author Josh de Leeuw. Edited by Kianté Fernandez
   * @see {@link https://www.jspsych.org/plugins/jspsych-visual-search-circle/ visual-search-circle plugin documentation on the orignal jspsych.org}
   **/
  class VisualSearchCirclePlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
        var paper_size = trial.circle_diameter + trial.target_size[0];
          // fixation location
        var fix_loc = this.generateFixationLoc(trial);
          // check for correct combination of parameters and create stimuli set
        var to_present = this.generatePresentationSet(trial);
          // stimulus locations on the circle
        var display_locs = this.generateDisplayLocs(to_present.length, trial);
          // get target to draw on
        display_element.innerHTML +=
          `<div id="jspsych-visual-search-circle-container" style="position: relative; width:${paper_size}px; height:${paper_size}px;"></div>`;
        var paper = display_element.querySelector("#jspsych-visual-search-circle-container");

        var waitingForFixationClick = false;

        const show_fixation = () => {
            paper.innerHTML +=
            //   `<img id='fixation' src='${trial.fixation_image}' style='position: absolute; top:${fix_loc[0]}px; left:${fix_loc[1]}px; width:${trial.fixation_size[0]}px; height:${trial.fixation_size[1]}px;'></img>`;
              `<img id='fixation' src='${trial.fixation_image}' style='position: absolute; top:${fix_loc[0]}px; left:${fix_loc[1]}px; width:${trial.fixation_size[0]}px; height:${trial.fixation_size[1]}px; cursor: pointer;'></img>`; // Ensure cursor: pointer; is set for visual cue
            this.jsPsych.pluginAPI.setTimeout(() => {
              show_search_array();
            }, trial.fixation_duration);
        };

        var start_time = performance.now();
        var responses = []; // Array to store response information

        const enableImageClicks = () => {
            display_element.querySelectorAll('.search-item').forEach((img, index) => {
              img.addEventListener('click', imageClickHandler);
            });
          };
      
          const disableImageClicks = () => {
            display_element.querySelectorAll('.search-item').forEach((img) => {
              img.removeEventListener('click', imageClickHandler);
            });
          };
        const imageClickHandler = (event) => {
            if (waitingForFixationClick) return; // Ignore clicks if waiting for a fixation click
      
            var end_time = performance.now();
            var rt = Math.round(end_time - start_time);
            var imgFileName = event.target.src.split('/').pop();
            responses.push({
              imgId: event.target.id,
              imgSrc: imgFileName,
              position: display_locs[parseInt(event.target.id.replace('img', ''), 10)], // Save the position
              rt: rt
            });
            event.target.classList.add('active', 'selected');
            // Hide all non-selected items
            display_element.querySelectorAll('.search-item:not(.selected)').forEach(img => {
              img.style.visibility = 'hidden'; // Use visibility to keep the layout stable
            });
            // Disable further image clicks and wait for a fixation click
            waitingForFixationClick = true;
            disableImageClicks();
          };
        
        const show_search_array = () => {
            // Set up the search items on the circle
            to_present.forEach((imgSrc, index) => {
              var imgId = 'img' + index;
              paper.innerHTML +=
//                `<img src='${imgSrc}' id='${imgId}' class='search-item' style='position: absolute; top:${display_locs[index][0]}px; left:${display_locs[index][1]}px; width:${trial.target_size[0]}px; height:${trial.target_size[1]}px;'></img>`;
                `<img src='${imgSrc}' id='${imgId}' class='search-item img-cropped' style='position: absolute; top:${display_locs[index][0]}px; left:${display_locs[index][1]}px; width:${trial.target_size[0]}px; height:${trial.target_size[1]}px;'></img>`;
            });
          
            // Enable clicks on all images
            enableImageClicks();
          
            // Set up the central fixation with a click event listener
            var fixation = paper.querySelector('#fixation');
            fixation.addEventListener('click', () => {
            if (!waitingForFixationClick) return; // Ignore if we're not waiting for a fixation click
          
            // Make all items visible again
            display_element.querySelectorAll('.search-item').forEach(img => {
              img.style.visibility = ''; // Reset visibility
            });

              fixation.classList.add('fixation-clicked');
              setTimeout(() => {
                fixation.classList.remove('fixation-clicked');
              }, 300); // Adjust the timeout duration as needed            

              // Check if enough responses have been collected
              if (responses.length >= trial.num_required_responses) {
                end_trial();
              } else {
                // Re-enable image clicks after fixation click
                enableImageClicks();
                waitingForFixationClick = false;
              }
            });
          };

        const end_trial = () => {
            // kill keyboard listeners
            if (typeof keyboardListener !== "undefined") {
                            this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }
            var trial_data = {
              num_required_responses: trial.num_required_responses,
              rt: JSON.stringify(responses.map(r => r.rt)),
              imgIds: JSON.stringify(responses.map(r => r.imgId)),
              imgSrcs: JSON.stringify(responses.map(r => r.imgSrc)),
              positions: JSON.stringify(responses.map(r => r.position)),
              locations: display_locs
            };
            display_element.innerHTML = "";
            this.jsPsych.finishTrial(trial_data);
          };
    
          if (trial.trial_duration !== null) {
            this.jsPsych.pluginAPI.setTimeout(() => {
              end_trial();
            }, trial.trial_duration);
          }
        show_fixation();
      }
      generateFixationLoc(trial) {
          var paper_size = trial.circle_diameter + trial.target_size[0];
          return [
              Math.floor(paper_size / 2 - trial.fixation_size[0] / 2),
              Math.floor(paper_size / 2 - trial.fixation_size[1] / 2),
          ];
      }
      generateDisplayLocs(n_locs, trial) {
          // circle params
          var diam = trial.circle_diameter; // pixels
          var radi = diam / 2;
          var paper_size = diam + trial.target_size[0];
          // stimuli width, height
          var stimh = trial.target_size[0];
          var stimw = trial.target_size[1];
          var hstimh = stimh / 2;
          var hstimw = stimw / 2;
          var display_locs = [];
          var random_offset = Math.floor(Math.random() * 360);
          for (var i = 0; i < n_locs; i++) {
              display_locs.push([
                  Math.floor(paper_size / 2 + this.cosd(random_offset + i * (360 / n_locs)) * radi - hstimw),
                  Math.floor(paper_size / 2 - this.sind(random_offset + i * (360 / n_locs)) * radi - hstimh),
              ]);
          }
          return display_locs;
      }
      generatePresentationSet(trial) {
          var to_present = [];
          if (trial.target !== null && trial.foil !== null && trial.set_size !== null) {
              if (trial.target_present) {
                  for (var i = 0; i < trial.set_size - 1; i++) {
                      to_present.push(trial.foil);
                  }
                  to_present.push(trial.target);
              }
              else {
                  for (var i = 0; i < trial.set_size; i++) {
                      to_present.push(trial.foil);
                  }
              }
          }
          else if (trial.stimuli !== null) {
              to_present = trial.stimuli;
          }
          else {
              console.error("Error in visual-search-circle plugin: you must specify an array of images via the stimuli parameter OR specify the target, foil and set_size parameters.");
          }
          return to_present;
      }
      cosd(num) {
          return Math.cos((num / 180) * Math.PI);
      }
      sind(num) {
          return Math.sin((num / 180) * Math.PI);
      }
      simulate(trial, simulation_mode, simulation_options, load_callback) {
          if (simulation_mode == "data-only") {
              load_callback();
              this.simulate_data_only(trial, simulation_options);
          }
          if (simulation_mode == "visual") {
              this.simulate_visual(trial, simulation_options, load_callback);
          }
      }
      create_simulation_data(trial, simulation_options) {
          const key = this.jsPsych.pluginAPI.getValidKey([
              trial.target_present_key,
              trial.target_absent_key,
          ]);
          const set = this.generatePresentationSet(trial);
          const default_data = {
              correct: trial.target_present
                  ? key == trial.target_present_key
                  : key == trial.target_absent_key,
              response: key,
              rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
              set_size: set.length,
              target_present: trial.target_present,
              locations: this.generateDisplayLocs(set.length, trial),
          };
          const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
          this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
          return data;
      }
      simulate_data_only(trial, simulation_options) {
          const data = this.create_simulation_data(trial, simulation_options);
          this.jsPsych.finishTrial(data);
      }
      simulate_visual(trial, simulation_options, load_callback) {
          const data = this.create_simulation_data(trial, simulation_options);
          const display_element = this.jsPsych.getDisplayElement();
          this.trial(display_element, trial);
          load_callback();
          if (data.rt !== null) {
              this.jsPsych.pluginAPI.pressKey(data.response, trial.fixation_duration + data.rt);
          }
      }
  }
  VisualSearchCirclePlugin.info = info;

  return VisualSearchCirclePlugin;

})(jsPsychModule);
