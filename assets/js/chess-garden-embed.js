(function setupChessGardenEmbed() {
    const frame = document.getElementById('chess-garden-frame');
    if (!frame) return;

    window.addEventListener('message', function(event) {
        if (event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
        if (!event.data || event.data.type !== 'chess-garden:resize') return;

        const height = Math.ceil(Number(event.data.height));
        if (!Number.isFinite(height) || height < 600 || height > 4000) return;
        frame.style.height = height + 'px';
    });
})();
