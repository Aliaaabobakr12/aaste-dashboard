import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
    width: 256,
    height: 256,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 40,
                    background: '#0f172a', // slate-900
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    borderRadius: '40px', // About 15-20% rounded
                }}
            >
                {/* Logo Text */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    ASTE<span style={{ color: '#10b981' }}>Dash</span>
                </div>

                {/* Separator Line */}
                <div
                    style={{
                        width: '80%',
                        height: '4px',
                        background: 'rgba(16, 185, 129, 0.3)', // emerald-500/30
                        margin: '12px 0',
                        borderRadius: '2px'
                    }}
                />

                {/* Arabic Subtitle */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: 24,
                        color: 'rgba(16, 185, 129, 0.8)', // emerald-500/80
                        letterSpacing: '0.1em',
                        fontWeight: 700
                    }}
                >
                    بالعربي
                </div>
            </div>
        ),
        // ImageResponse options
        {
            // For convenience, we can re-use the exported icons size metadata
            // config to also set the ImageResponse's width and height.
            ...size,
        }
    );
}
