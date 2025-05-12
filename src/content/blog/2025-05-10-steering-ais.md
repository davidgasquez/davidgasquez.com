---
title: "Steering AIs"
date: 2025-05-10
slug: steering-ais
---

I've been spending some time thinking about ideas that Vitalik shared about having ["AI as the engine, humans as the steering wheel"](https://vitalik.eth.limo/general/2025/02/28/aihumans.html) and participating in some of the experiments they are doing around them. As a Kaggle enthusiast and data person working around the blockchain space, experiments like Deepfunding align perfectly with my interests and skillset!

## What is the main idea?

The gist is simple. Leverage ML models (I don't really like calling these "AI") as a powerful "engine" to execute a vast number of decisions, while humans provide high-quality, concise guidance (training and test data) as the "steering wheel".

Models scale more efficiently than humans. Adding human oversight on values and objectives to the models make them useful.
Instead of relying on a single, complex AI model, what if we create [a simple, open, and stable mechanisms](https://nakamoto.com/credible-neutrality/) (like a Kaggle competition of sorts) where diverse models compete as players to best align with the human data and goals?
Humans set the "objective function" and/or verify model outputs, while models compete to optimize for it like, again, in a Kaggle competition.

## Building Useful Models

So far, I'm having fun participating in the ML competitions hosted by [Pond](https://cryptopond.xyz/modelfactory/list). Right now, there is a diverse set of competitions that are open to anyone. Download or gather some data, train a model, submit to the leaderboard and see how it performs! Reward prizes are generous and for now, there are not that many participants.

While the experience is engaging and is working well (especially given that these are new processes and infrastructure), I've been thinking about how we could make it better for every party involved (hosts and participants).

For that, let me share a very high level view of the challenges I've noticed so far.

1. **Transparency and Verifiability** ([credible neutrality](https://nakamoto.com/credible-neutrality/))
   - Once the competition ends, how do we know that the leaderboard is what it is without trusting the organizers?
   - How do we check that there were no bugs in the scoring script?
2. **Mechanism Design and Evaluation**
   - Is perhaps the Nth model better at a subset of the data than the top 3 models? Shouldn't that be rewarded?
   - How can prizes get fairly distributed in a way that doesn't incentivize gaming the system? Right now, the incentive is to create many accounts in the competition platform and send lots of submissions just in case there is a great one.
3. **Data and Metrics Diversity**
   - How can collectively improve the competition designs to allow more diverse data and metrics to avoid Goodhart's law?
4. **Trust and Incentives**
   - Is there a way to run things without a central trusted party (insider advantage, selling datasets, ...)? Pond is great but, wouldn't it be better if these competitions were viable without a central platform?
   - How to incentivize reporting bad behavior (whitehat style) or raising issues with the competition that will make the competition better?

## Some Ideas

I want to mention again that this space is very novel and still evolving and learning! It is great to have the opportunity to participate and help shape the future of programs like Deepfunding!

Alright, here are a few things I thought would make the experience better.

- The competition platforms (there could be multiple) should **make public any scripts used to (1) generate datasets, (2) generate ground truth, (3) score submissions**. once the competition ends, the **submissions from everyone and the final ground truth should be made public** too so the community can verify ([in a credibly neutral way](https://nakamoto.com/credible-neutrality/)) the scores. A big difference between this general idea of incentivizing useful/aligned ML models with Prediction Markets is that the ground truth is known and we have to trust someone, so we should at least make things as open / transparent as possible and viable for the hosts of the competitions to run these themselves (they have incentives on promoting the best models).
- **Reward models accordingly to their predictive power in the test set**. There are several ways to do this and they're all more or less complicated (composite model, SHAP values, ...). We should explore them and see which ones work best for each competition. The ideal I'd love to see is for **any useful signal to be rewarded**. A plurality of models and a plurality of metrics to avoid Goodhart's law and cover different aspects/approaches. Using and rewarding only a few models adds biases (e.g: the DeepFunding competition results are sensitive to the train / test split, the sybil detection competition could produce models trained to ignore certain types of sybils, ...).
- **Don't add artificial constraints that can be gamed / abused**. Right now, it would be possible for an attacker to create a lot of accounts and submit a lot of predictions. This can discourage honest participants from engaging as they're not able to compete fairly against potential abusers. Same thing with limiting usage of external datasets (you cannot hide data when there is a reward on discovering and using it). These two things are, at the same time, very hard to detect (legitimize). This is another area where the competition design should be carefully thought out to not reward bad behavior. One way to do this is **opening the competition design phase to the community** so everyone can weigh in on the shape of the competition. For this, a "central" discussion platform for the competition could be useful!
- Competitions should **reward people improving the competition**. If someone finds a bug on the scoring script, discovers some data leakage, or anything else that could make the competition useless, they should be rewarded. This also means competitions needs a way to evolve in real time. This is something that happens in Kaggle competitions too. Perhaps the competition hosts can have a committee that has the power to reshape the competition if needed?
- In the same vein, **the competition shouldn't end when the final leaderboard is revealed**. For everyone to learn, there should be a phase where the hosts facilitate or incentivize the community to perform meta-analysis on the submitted models and results. Both for detecting issues, biases, ... and for sharing knowledge.
- Lastly, write-ups are now required. While some of these are interesting, I suspect most of them are or will be LLM generated and not very detailed. For these final write-ups, **having a bonus** (or different price pool) **if the code is open source + reproducible** (e.g: colab notebook that can be run by anyone and produces the same submission file) could lift everyone's boat.

## Conclusion

The space is moving fast and it's exciting to be part of it! Participating in these competitions is a great way to learn about ML and explore interesting problems. Looking forward to see how this evolves and how can I use my skills to make it better!
