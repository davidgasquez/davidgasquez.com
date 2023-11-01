---
title: "Downloading the Watch Later YouTube Playlist"
date: 2023-10-01
slug: download-watchlater
---

I sort of knew about [`yt-dlp`](https://github.com/yt-dlp/yt-dlp), a fork of [`youtube-dl`](https://github.com/ytdl-org/youtube-dl) with some extra features, but I never really used it until recently. The goal I was trying to archieve was to download all the videos I've been storing in my [Watch Later playlist](https://www.youtube.com/playlist?list=WL) over time so I could see them on my TV, without ads, and with Spanish subtitles.

As usually with awesome CLI tools, the solution was one command away!

```bash
yt-dlp --sub-lang "es-en" \
    --write-auto-sub \
    --embed-subs \
    --merge-output-format mp4 \
    -S acodec:aac -S vcodec:h264 \
    -f 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best' \
    :ytwatchlater --cookies-from-browser brave
```

Let's break it down:

- `--sub-lang "es-en"`: Download Spanish subtitles.
- `--write-auto-sub`: Download subtitles even if they are not available in the video. This will translate English subtitles to Spanish or the English auto-generated ones!
- `--embed-subs`: Embed subtitles in the video.
- `--merge-output-format mp4`: Merge everything in a single file.
- `-S acodec:aac -S vcodec:h264`: Use AAC and H264 codecs for audio and video.
- `-f 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'`: Select the best video and audio streams available. This is the default option but I wanted to be explicit.
- `:ytwatchlater`: Download the videos in the `ytwatchlater` playlist.
- `--cookies-from-browser brave`: Use the cookies from the Brave browser to authenticate with YouTube.

And that's it! The command will download all the videos in the playlist and put them in your current directory. Enjoy!
