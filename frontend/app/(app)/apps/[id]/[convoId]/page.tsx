import ArticleSummarizerPage from "../article-summarizer-page";
import YouTubeSummarizerPage from "../youtube-summarizer-page";

interface AppPageProps {
    params: Promise<{
        id: string;
        convoId: string;
    }>
}

export default async function AppPage({ params }: AppPageProps) {
    const { id, convoId } = await params;

    switch (id) {
        case "article-summarizer":
            return <ArticleSummarizerPage convoId={convoId} />;
        case "youtube-summarizer":
            return <YouTubeSummarizerPage convoId={convoId} />;
        default:
            return <div>AppPage</div>;
    }
}