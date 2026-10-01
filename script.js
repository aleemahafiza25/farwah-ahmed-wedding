const opening = document.getElementById("opening");
const button = document.getElementById("openButton");
const backgroundMusic =
    document.getElementById("backgroundMusic");
let started = false;


/* =========================================
   LOCK PAGE ON INITIAL LOAD
========================================= */

document.body.classList.add("opening-locked");


/* =========================================
   OPENING
========================================= */

button.addEventListener("click", () => {

    if (started) {
        return;
    }

    started = true;


    /* =========================================
       START BACKGROUND MUSIC
    ========================================= */

    if (backgroundMusic) {

        backgroundMusic.volume = 1;

        backgroundMusic
            .play()
            .catch(error => {
                console.log(
                    "Music could not start:",
                    error
                );
            });

    }


    /* =========================================
       START CURTAIN OPENING
    ========================================= */

    opening.classList.add("open");


    setTimeout(() => {

        opening.classList.add("complete");

    }, 3200);


    setTimeout(() => {

        opening.classList.add("names-visible");

        document.body.classList.remove(
            "opening-locked"
        );

        document.body.classList.add(
            "site-unlocked"
        );

    }, 3450);

});

/* =========================================
   SCRATCH TO REVEAL
========================================= */
/* =========================================
   SCRATCH TO REVEAL
========================================= */

const scratchCanvas =
    document.getElementById("scratchCanvas");

const scratchFrame =
    document.querySelector(".scratch-frame");

const petalContainer =
    document.getElementById("petalContainer");


if (
    scratchCanvas &&
    scratchFrame
) {

    const ctx =
        scratchCanvas.getContext("2d");


    let isScratching = false;

    let lastPoint = null;

    let strokeCount = 0;

    let revealed = false;


    /* =====================================
       SETUP
    ===================================== */

    function setupScratch() {

        const rect =
            scratchFrame.getBoundingClientRect();


        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        scratchCanvas.width =
            rect.width * dpr;

        scratchCanvas.height =
            rect.height * dpr;


        scratchCanvas.style.width =
            rect.width + "px";

        scratchCanvas.style.height =
            rect.height + "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        drawScratchSurface();

    }


    /* =====================================
       DRAW SCRATCH COVER
    ===================================== */

    function drawScratchSurface() {

        const width =
            scratchFrame.clientWidth;

        const height =
            scratchFrame.clientHeight;


        /*
            Rich burgundy / antique gold
            scratch coating.
        */

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                width,
                height
            );


        gradient.addColorStop(
            0,
            "#580813"
        );


        gradient.addColorStop(
            .45,
            "#e41529"
        );


        gradient.addColorStop(
            1,
            "#58101a"
        );


        ctx.globalCompositeOperation =
            "source-over";


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
            Fine gold border.
        */

        ctx.strokeStyle =
            "rgba(236, 204, 151, .85)";

        ctx.lineWidth =
            1;


        ctx.strokeRect(
            16,
            16,
            width - 32,
            height - 32
        );


        /*
            Scratch text.
        */

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        ctx.fillStyle =
            "#f3dfb5";


        ctx.font =
            "13px Georgia";


        ctx.fillText(
            "SCRATCH TO REVEAL",
            width / 2,
            height / 2 - 8
        );


        ctx.font =
            "12px Georgia";


        ctx.fillStyle =
            "rgba(243,223,181,.75)";


        ctx.fillText(
            "✦",
            width / 2,
            height / 2 + 18
        );

    }


    /* =====================================
       GET POINTER
    ===================================== */

    function getPointer(
        event
    ) {

        const rect =
            scratchCanvas.getBoundingClientRect();


        return {

            x:
                event.clientX -
                rect.left,

            y:
                event.clientY -
                rect.top

        };

    }


    /* =====================================
       ERASE
    ===================================== */

    function erase(point) {

        ctx.save();


        /*
            This is the important part:
            scratched areas become
            completely transparent.
        */

        ctx.globalCompositeOperation =
            "destination-out";


        ctx.lineWidth =
            38;

        ctx.lineCap =
            "round";

        ctx.lineJoin =
            "round";


        ctx.beginPath();


        if (lastPoint) {

            ctx.moveTo(
                lastPoint.x,
                lastPoint.y
            );

        } else {

            ctx.moveTo(
                point.x,
                point.y
            );

        }


        ctx.lineTo(
            point.x,
            point.y
        );


        ctx.stroke();


        ctx.restore();


        lastPoint =
            point;


        strokeCount++;


        /*
            More generous reveal threshold.
        */

        if (
            strokeCount >= 70
        ) {

            revealScratch();

        }

    }


    /* =====================================
       START SCRATCHING
    ===================================== */

    scratchCanvas.addEventListener(
        "pointerdown",
        (event) => {

            if (revealed) {
                return;
            }


            isScratching =
                true;


            lastPoint =
                getPointer(event);


            scratchCanvas.setPointerCapture(
                event.pointerId
            );


            /*
                Remove a little circle
                immediately where the
                finger touches.
            */

            erase(
                lastPoint
            );

        }
    );


    /* =====================================
       MOVE
    ===================================== */

    scratchCanvas.addEventListener(
        "pointermove",
        (event) => {

            if (
                !isScratching ||
                revealed
            ) {

                return;

            }


            const point =
                getPointer(event);


            erase(point);

        }
    );


    /* =====================================
       END
    ===================================== */

    function stopScratch() {

        isScratching =
            false;

        lastPoint =
            null;

    }


    scratchCanvas.addEventListener(
        "pointerup",
        stopScratch
    );


    scratchCanvas.addEventListener(
        "pointercancel",
        stopScratch
    );


    scratchCanvas.addEventListener(
        "pointerleave",
        () => {

            /*
                Don't cancel scratching
                aggressively on mobile.
            */

        }
    );


    /* =====================================
       REVEAL
    ===================================== */

    function revealScratch() {

        if (revealed) {
            return;
        }


        revealed =
            true;


        /*
            Fade the remaining coating away.
        */

        scratchCanvas.style.transition =
            "opacity .7s ease";


        scratchCanvas.style.opacity =
            "0";


        setTimeout(() => {

            scratchCanvas.style.display =
                "none";


            startPetals();

        }, 100);

    }


    /* =====================================
       FALLING PETALS
    ===================================== */

    function startPetals() {

        if (!petalContainer) {
            return;
        }


        petalContainer.classList.add(
            "active"
        );


        /*
            Create 36 petals.
        */

        for (
            let i = 0;
            i < 36;
            i++
        ) {

            const petal =
    document.createElement("span");


petal.className =
    "petal";


/*
    Alternate burgundy and cream.
*/

if (i % 2 === 0) {

    petal.classList.add(
        "burgundy"
    );

} else {

    petal.classList.add(
        "cream"
    );
}


/*
    A few different sizes,
    but all remain small.
*/

if (i % 4 === 0) {

    petal.classList.add(
        "small"
    );

}

if (i % 7 === 0) {

    petal.classList.add(
        "large"
    );

}

            /*
                Random horizontal position.
            */

            petal.style.left =
                Math.random() * 100 +
                "%";


            /*
                Different falling speeds.
            */

            const duration =
                2.8 +
                Math.random() * 1.8;


            petal.style.setProperty(
                "--fall-duration",
                duration + "s"
            );


            /*
                Random horizontal drift.
            */

            petal.style.setProperty(
                "--drift-1",
                (Math.random() * 100 - 50) + "px"
            );


            petal.style.setProperty(
                "--drift-2",
                (Math.random() * 160 - 80) + "px"
            );


            petal.style.setProperty(
                "--drift-3",
                (Math.random() * 200 - 100) + "px"
            );


            petal.style.setProperty(
                "--drift-4",
                (Math.random() * 240 - 120) + "px"
            );


            /*
                Different delays so they
                don't all start together.
            */

            const delay =
    Math.random() * 0.6;

petal.style.setProperty(
    "--fall-delay",
    delay + "s"
);

            petalContainer.appendChild(
                petal
            );


            /*
                Clean up after falling.
            */

            setTimeout(() => {

                petal.remove();

            }, (duration + 2) * 1000);

        }

    }


    /* =====================================
       INITIALIZE
    ===================================== */

    setupScratch();


    window.addEventListener(
        "resize",
        setupScratch
    );

}

/* =====================================================
   LIVE WEDDING COUNTDOWN
===================================================== */

const countdownTarget =
    new Date(
        "2026-10-22T11:30:00+05:30"
    ).getTime();


const daysElement =
    document.getElementById("days");

const hoursElement =
    document.getElementById("hours");

const minutesElement =
    document.getElementById("minutes");

const secondsElement =
    document.getElementById("seconds");


function updateCountdown() {

    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {

        return;

    }


    const now =
        Date.now();


    const difference =
        countdownTarget - now;


    if (difference <= 0) {

        daysElement.textContent =
            "00";

        hoursElement.textContent =
            "00";

        minutesElement.textContent =
            "00";

        secondsElement.textContent =
            "00";

        return;

    }


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const days =
        Math.floor(
            totalSeconds / 86400
        );


    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    daysElement.textContent =
        String(days).padStart(2, "0");


    hoursElement.textContent =
        String(hours).padStart(2, "0");


    minutesElement.textContent =
        String(minutes).padStart(2, "0");


    secondsElement.textContent =
        String(seconds).padStart(2, "0");

}


/* Update immediately */

updateCountdown();


/* Update every second */

setInterval(
    updateCountdown,
    1000
);

/* =====================================================
   REPLAY INVITATION
===================================================== */



/* =====================================================
   MUSIC CONTROL
===================================================== */

const musicButton =
    document.getElementById("musicButton");


if (
    musicButton &&
    backgroundMusic
) {

    musicButton.addEventListener(
        "click",
        () => {

            if (
                backgroundMusic.paused
            ) {

                backgroundMusic
                    .play()
                    .then(() => {

                        musicButton.classList
                            .remove("paused");

                        musicButton.textContent =
                            "♪";

                        musicButton.setAttribute(
                            "aria-label",
                            "Pause music"
                        );

                    })
                    .catch(error => {

                        console.log(
                            "Music could not start:",
                            error
                        );

                    });

            } else {

                backgroundMusic.pause();

                musicButton.classList
                    .add("paused");

                musicButton.textContent =
                    "Ⅱ";

                musicButton.setAttribute(
                    "aria-label",
                    "Play music"
                );

            }

        }
    );

}


/* =====================================================
   REPLAY INVITATION
===================================================== */

const replayButton =
    document.getElementById("replayButton");


/*
   Make sure the browser does not restore
   the previous scroll position after reload.
*/

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}


/*
   When the page reloads, start at the
   very top again.
*/

window.addEventListener("load", () => {

    window.scrollTo(0, 0);

});


/*
   Replay button
*/

if (replayButton) {

    replayButton.addEventListener(
        "click",
        () => {

            /*
               Scroll to the beginning first.
            */

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant"
            });


            /*
               Small delay makes sure the browser
               registers the top position before
               reloading the invitation.
            */

            setTimeout(() => {

                window.location.reload();

            }, 100);

        }
    );

}