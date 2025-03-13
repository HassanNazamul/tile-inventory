

export default function AuthPageTransition() {




    return (
        <div className="relative">
            <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-white" style={{ animationDuration: '2s' }}></div>
            </div>
        </div>
    );
}
