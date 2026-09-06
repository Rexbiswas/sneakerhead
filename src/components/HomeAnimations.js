import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export const useHomeAnimations = (containerRef) => {
    useGSAP(() => {
        // Slide Right for Home Content
        gsap.from(".home-content", {
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });

        // Float Image Animation - NOTE: This was previously conflicting with React parallax
        // Only enable if you want the container to float independently of the mouse parallax
        /*
        gsap.to(".home-image-container", {
          y: -20,
          rotation: -12,
          keyframes: {
            "0%": { y: 0, rotation: -15 },
            "50%": { y: -20, rotation: -12 },
            "100%": { y: 0, rotation: -15 }
          },
          duration: 4,
          repeat: -1,
          ease: "power1.inOut"
        });
        */

        gsap.to(".gc-1", {
            y: -15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".gc-2", {
            y: -15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1
        });

        gsap.to(".scroll-wheel", {
            y: 10,
            opacity: 0,
            duration: 1.5,
            repeat: -1,
            ease: "none"
        });

        gsap.fromTo(".scroll-indicator",
            { opacity: 0.6, y: 0 },
            { opacity: 1, y: -5, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" }
        );

        // Marquee
        gsap.to(".marquee-content", {
            x: "-50%",
            duration: 20,
            repeat: -1,
            ease: "linear"
        });

        gsap.fromTo(".holo-price",
            { y: 0, rotation: 5, scale: 1 },
            {
                y: -15,
                rotation: 8,
                scale: 1.02,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                transformOrigin: "center"
            }
        );

    }, { scope: containerRef });
};
