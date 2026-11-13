// Files needed by every possible study condition, including optional retry trials.
self.STUDY_CACHE_NAME = "jspsych-offline-v2";
self.STUDY_VIDEO_FILES = [
  "Ready.png", "YES.png", "NO.png", "age.m4v", "hello2.mp4",
  "play_for_real.mp4", "mem_intro.mp4", "thanksforplaying_audio.mp4",
  "warmup_trial_correct_audio.mp3",
  ...[1, 2].flatMap((v) => [
    `warmup_v${v}.mp4`, `warmup_redo_v${v}.mp4`,
    ...["A", "B"].map((c) => `ind_sarca_${c}_v${v}.m4v`),
    `glorp_v${v}.mp4`, `closenesstonature_affect_v${v}.m4v`,
    `practice_warmup_v${v}.mp4`,
    `practice_birds_fly_v${v}.m4v`,
    `practice_birds_fly_feedback_v${v}.mp4`,
    `practice_animals_lay_eggs_v${v}.m4v`,
    `practice_animals_lay_eggs_feedback_v${v}.mp4`,
    `practice_bird_car_v${v}.m4v`,
    `practice_bird_car_feedback_v${v}.mp4`,
    ...["thoughts", "feelings", "grateful", "listen", "talk", "move", "friends"]
      .map((name) => `trees_${name}_v${v}.mp4`),
    ...["tree_protect", "tree_important", "bug_protect", "bug_important"]
      .map((name) => `mor_${name}_v${v}.m4v`),
    `exp_time_v${v}.m4v`, `exp_books_shows_v${v}.m4v`, `area_v${v}.mp4`,
    ...["A", "B"].map((c) => `eco_sarca_${c}_v${v}.mp4`),
    `eco_glorp_v${v}.mp4`, `kind_sarca_v${v}.mp4`, `kind_glorp_v${v}.mp4`,
  ]),
].map((name) => `Tablet_Study1_Videos/${name}`);

self.STUDY_LOCAL_FILES = [
  "./", "index.html", "admin/", "admin/index.html", "manifest.json",
  "experiment.js", "admin/admin.js", "offline-assets.js",
  "icon-192.png", "icon-512.png", ...self.STUDY_VIDEO_FILES,
];

// Match the URLs actually loaded by index.html and admin/index.html.
self.STUDY_CDN_FILES = [
  "https://unpkg.com/jspsych@8.3.0/css/jspsych.css",
  "https://unpkg.com/jspsych@8.3.0/dist/index.browser.min.js",
  "https://unpkg.com/@jspsych/offline-storage@0.4.0/dist/index.browser.js",
  "https://unpkg.com/@jspsych/plugin-video-button-response@2.1.0/dist/index.browser.min.js",
  "https://unpkg.com/@jspsych-contrib/plugin-video-hotspots@1.1.0/dist/index.browser.min.js",
  "https://unpkg.com/jspsych@8",
  "https://unpkg.com/@jspsych/offline-storage@0.4.0",
];
