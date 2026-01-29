import { DataSourcesView } from "@/components/data/data-sources-view";
import { BackendFeaturesView } from "@/components/data/backend-features-view";

export default function DataPage() {
    return (
        <div className="space-y-8">
            <BackendFeaturesView />
            <div className="border-t pt-8">
                <h2 className="text-2xl font-bold tracking-tight mb-6">External Data Sources</h2>
                <DataSourcesView />
            </div>
        </div>
    );
}
