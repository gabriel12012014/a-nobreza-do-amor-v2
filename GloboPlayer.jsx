import React, { useEffect, useRef } from 'react';

const GloboPlayer = ({ videoId = "14174319", className = "video-player-container" }) => {
    const playerContainerRef = useRef(null);
    const playerInstanceRef = useRef(null);

    useEffect(() => {
        const initializePlayer = () => {
            if (playerInstanceRef.current) return;

            if (typeof window.WM !== 'undefined' && window.WM.Player) {
                playerInstanceRef.current = new window.WM.Player({
                    videosIDs: videoId,
                    width: "100%",
                    height: "100%",
                    autoPlay: true,
                    muted: true,
                    skipDFP: true,
                    loop: true,
                });

                if (playerContainerRef.current) {
                    playerInstanceRef.current.attachTo(playerContainerRef.current);
                }
            }
        };

        const onPlayerAvailable = () => {
            if (playerContainerRef.current) {
                initializePlayer();
            }
        };

        const checkPlayerReady = () => {
            if (typeof window.WM !== "undefined" && window.WM.playerAvailable) {
                window.WM.playerAvailable.then(onPlayerAvailable);
            } else {
                setTimeout(checkPlayerReady, 100);
            }
        };

        checkPlayerReady();

        return () => {
            playerInstanceRef.current = null;
            if (playerContainerRef.current) {
                playerContainerRef.current.innerHTML = '';
            }
        };
    }, [videoId]);

    return (
        <div
            id="player-wrapper"
            ref={playerContainerRef}
            className={className}
        >
            <div className="loading-placeholder">Carregando player...</div>
        </div>
    );
};

export default GloboPlayer;
