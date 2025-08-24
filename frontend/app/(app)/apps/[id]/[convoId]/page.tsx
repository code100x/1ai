import ArticleSummarizerPage from "../article-summarizer-page";

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
        default:
            return <div>AppPage</div>;
    }
}