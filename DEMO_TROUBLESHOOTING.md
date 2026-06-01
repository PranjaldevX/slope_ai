# 🔧 Demo Video Troubleshooting

**Common issues and quick fixes while recording**

---

## 🚨 EXTENSION ISSUES

### Extension Not Showing Up

**Problem**: Extension icon not in toolbar

**Fix**:
```bash
1. Go to chrome://extensions/
2. Find "Information Density Filter"
3. Click the reload icon (circular arrow)
4. Pin the extension (click pin icon)
```

### Extension Not Scanning

**Problem**: Click extension, nothing happens

**Fix**:
```bash
1. Reload the webpage (F5)
2. If still not working:
   cd extension
   npm run build
3. Reload extension in chrome://extensions/
4. Reload webpage again
```

### Paragraphs Not Fading

**Problem**: Extension scans but nothing changes on page

**Fix**:
1. Check if you're on a supported page (not chrome:// pages)
2. Open DevTools (F12) → Console tab
3. Look for errors
4. Reload page and try again

---

## 🎤 RECORDING ISSUES

### No Audio

**Problem**: Video has no sound

**Fix**:
1. **Before recording**: Test mic
   - Record 5 seconds
   - Play it back
   - Hear yourself?
2. **In OBS**: Settings → Audio → Desktop Audio
3. **In Loom**: Check mic permissions

### Audio Too Quiet

**Problem**: Can barely hear you

**Fix**:
1. Move closer to mic (6-12 inches)
2. Speak louder (project your voice!)
3. In OBS: Audio Mixer → increase mic volume
4. After recording: Boost audio in editor

### Background Noise

**Problem**: Fan, traffic, people talking

**Fix**:
1. Close windows
2. Turn off fan/AC temporarily
3. Record when quiet
4. Use noise suppression in OBS (Filters → Noise Suppression)

---

## 🖥️ SCREEN RECORDING ISSUES

### Laggy Recording

**Problem**: Video stutters or freezes

**Fix**:
1. Close other apps (especially Chrome tabs)
2. Lower recording quality (720p instead of 1080p)
3. In OBS: Settings → Output → Lower bitrate
4. Restart computer if needed

### Wrong Screen Captured

**Problem**: Recording wrong monitor

**Fix**:
1. In OBS: Sources → Display Capture → Properties
2. Select correct monitor
3. Test before full recording

### Cursor Not Showing

**Problem**: Can't see mouse pointer

**Fix**:
1. In OBS: Sources → Add → Cursor
2. Or use Windows built-in: Win+G → Settings → Capture cursor

---

## 🌐 WEBSITE ISSUES

### Amazon Not Loading

**Problem**: Amazon blocks or loads slowly

**Fix**:
1. Use incognito mode (Ctrl+Shift+N)
2. Or use your test pages instead
3. Or try different product page

### Extension Blocked on Site

**Problem**: "Extension cannot run on this page"

**Fix**:
1. Some sites block extensions
2. Use different website
3. Or use your test pages (always work!)

### Reviews Not Showing

**Problem**: Amazon page has no reviews

**Fix**:
1. Search for popular products: "wireless earbuds", "phone case"
2. Pick product with 100+ reviews
3. Scroll down to reviews section

---

## 🎬 RECORDING SOFTWARE ISSUES

### OBS Won't Start

**Problem**: OBS crashes or won't open

**Fix**:
1. Restart computer
2. Update OBS (obsproject.com)
3. Use alternative: Loom or Windows Game Bar

### Can't Find Recording

**Problem**: Where did my video go?

**Fix**:
1. **OBS**: File → Show Recordings
2. **Loom**: Check loom.com/videos
3. **Game Bar**: Videos folder in user directory

### File Too Large

**Problem**: Video is 500MB+

**Fix**:
1. Use HandBrake (free) to compress
2. Or upload to YouTube (it compresses automatically)
3. Next time: Lower recording quality

---

## 💬 SPEAKING ISSUES

### Keep Saying "Um"

**Problem**: Too many filler words

**Fix**:
1. Pause instead of saying "um"
2. Edit pauses out later
3. Or just leave them - it's natural!
4. Practice once without recording

### Forgot What to Say

**Problem**: Brain freeze mid-recording

**Fix**:
1. Pause recording
2. Check DEMO_QUICK_REFERENCE.md
3. Take deep breath
4. Continue recording
5. Edit pause out later

### Speaking Too Fast

**Problem**: Racing through script

**Fix**:
1. Take deep breath before each section
2. Imagine explaining to a friend
3. Pause between sentences
4. It's okay to go slower!

---

## 🐛 DEMO ISSUES

### Feature Not Working

**Problem**: Something broke during demo

**Fix**:
1. **Stay calm** - don't panic on camera
2. Say: "Let me try that again"
3. Reload page
4. Try again
5. If still broken: Skip it, mention in closing

### Wrong Result Shown

**Problem**: Extension flagged wrong content

**Fix**:
1. This is actually good - shows honesty!
2. Say: "Interesting, it didn't flag this one"
3. Try different example
4. Or explain why (threshold, content type)

### Clicked Wrong Thing

**Problem**: Opened wrong tab/window

**Fix**:
1. Say: "Oops, wrong tab"
2. Go to correct tab
3. Continue
4. Edit it out later (or leave it - shows authenticity!)

---

## ⏱️ TIMING ISSUES

### Video Too Long

**Problem**: Recording is 6+ minutes

**Fix**:
1. Use shorter script (see DEMO_VIDEO_SCRIPT.md)
2. Or edit out slow parts
3. Or just submit it - 6 minutes is fine!

### Video Too Short

**Problem**: Only 1.5 minutes

**Fix**:
1. Add more examples
2. Show accuracy results
3. Explain innovation more
4. Show GitHub repo

### Ran Out of Things to Say

**Problem**: Finished at 2 minutes, need more

**Fix**:
1. Show test pages
2. Explain each metric
3. Show code structure
4. Demonstrate on more websites

---

## 🎨 VISUAL ISSUES

### Screen Too Cluttered

**Problem**: Too many windows/tabs visible

**Fix**:
1. Before recording: Close everything
2. Only keep needed tabs
3. Hide bookmarks bar (Ctrl+Shift+B)
4. Full screen browser (F11)

### Text Too Small

**Problem**: Can't read text in video

**Fix**:
1. Zoom in browser (Ctrl + +)
2. Increase font size
3. Record in 1080p (not 720p)
4. Move closer to important text

### Colors Look Bad

**Problem**: Extension colors not visible

**Fix**:
1. Use light theme (not dark mode)
2. Increase contrast
3. Or just mention: "See the red border here"

---

## 🔄 STARTING OVER

### When to Re-record:

**Major issues** (start over):
- ❌ No audio at all
- ❌ Extension completely broken
- ❌ Wrong screen captured
- ❌ Major technical failure

**Minor issues** (keep going):
- ✅ Said "um" a few times
- ✅ Small mistake in explanation
- ✅ Clicked wrong thing briefly
- ✅ Paused to think

### How to Re-record:

1. Take 5-minute break
2. Review what went wrong
3. Fix the issue
4. Test everything again
5. Record again (you'll do better!)

---

## 💡 PRO TIPS

### Before Recording:

1. **Test everything** (5 minutes)
   - Extension works?
   - Websites load?
   - Mic works?
   - Recording software ready?

2. **Practice once** (optional)
   - Go through flow without recording
   - Find issues before recording
   - Get comfortable with script

3. **Prepare environment**
   - Close other apps
   - Silence phone
   - Tell people you're recording
   - Good lighting (face camera)

### During Recording:

1. **Pause, don't stop**
   - If you mess up, pause
   - Collect thoughts
   - Continue recording
   - Edit pauses out later

2. **Show, don't tell**
   - Let extension do the work
   - Point to things on screen
   - Click and demonstrate

3. **Be yourself**
   - Casual language is fine
   - Personality is good
   - Enthusiasm is great!

### After Recording:

1. **Watch it once**
   - Does it make sense?
   - Audio clear?
   - Demo works?

2. **Edit if needed** (optional)
   - Cut long pauses
   - Remove mistakes
   - Add text overlays

3. **Upload and test**
   - YouTube link works?
   - Video plays?
   - Audio clear?

---

## 🆘 EMERGENCY BACKUP PLAN

### If Everything Fails:

**Option 1: Screenshots + Voiceover**
1. Take screenshots of each step
2. Record voiceover separately
3. Combine in video editor
4. Not ideal, but works!

**Option 2: Loom (Easiest)**
1. Install Loom extension
2. Click Loom icon
3. Record screen + mic
4. Done! Auto-uploads

**Option 3: Phone Recording**
1. Record screen with phone camera
2. Point at monitor
3. Narrate while recording
4. Not great quality, but shows it works!

---

## 📞 LAST RESORT

### If You Can't Record Video:

**Alternative**: Detailed screenshots + written explanation

1. Take 10-15 screenshots showing:
   - Extension scanning blog
   - Results on dashboard
   - Amazon reviews detection
   - Accuracy metrics

2. Write detailed explanation (500 words)

3. Submit as "Demo Documentation"

**Note**: Video is much better for Live Fire bonus, but this works if absolutely necessary!

---

## ✅ FINAL CHECKLIST

Before you start recording:

- [ ] Extension loaded and working
- [ ] Websites open in tabs
- [ ] Desktop clean
- [ ] Mic tested
- [ ] Recording software ready
- [ ] Script/reference card nearby
- [ ] Water nearby
- [ ] Phone silenced
- [ ] People know you're recording
- [ ] Deep breath taken 😊

---

## 🎬 YOU GOT THIS!

**Remember**:
- Imperfect is fine
- Judges are developers, not film critics
- Your project is solid
- Just show what you built!

**Most important**:
- Have fun!
- Be proud!
- Show your work!

---

**Now go make that video! 🚀**

*If you hit an issue not listed here, just pause, fix it, and continue. You got this!*
