import Image from "next/image"

export default function Sources({
  sources,
  isLoading,
}: {
  sources: { name: string; url: string }[]
  isLoading: boolean
}) {
  return (
    <div className="max-lg:-order-1 lg:flex lg:w-full lg:max-w-[300px] lg:flex-col">
      <div className="flex items-start gap-4 pb-4">
        <h3 className="uppercase text-gray-600 text-xs font-normal tracking-tight">Sources:</h3>
      </div>
      <div className="flex w-full items-center gap-4 pb-4 max-lg:overflow-x-scroll lg:grow lg:flex-col lg:overflow-y-scroll lg:pb-0 pt-8">
        {isLoading ? (
          <>
            <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-xl bg-gray-200" />
            <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-xl bg-gray-200" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-xl bg-gray-200 sm:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-xl bg-gray-200 sm:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-xl bg-gray-200 lg:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-xl bg-gray-200 lg:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-xl bg-gray-200 lg:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-xl bg-gray-200 lg:block" />
            <div className="hidden h-20 w-[260px] max-w-sm animate-pulse rounded-xl bg-gray-200 lg:block" />
          </>
        ) : sources.length > 0 ? (
          sources.map((source) => <SourceCard source={source} key={source.url} />)
        ) : (
          <div className="text-sm text-gray-600">Could not fetch sources.</div>
        )}
      </div>
    </div>
  )
}

const SourceCard = ({ source }: { source: { name: string; url: string } }) => {
  return (
    <div className="flex h-20 w-full items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-100/50 px-4 border-gray-200 border border-solid bg-gray-50">
      <div className="shrink-0">
        <Image
          unoptimized
          src={`https://www.google.com/s2/favicons?domain=${source.url}&sz=128`}
          alt={source.url}
          className="rounded-full"
          width={36}
          height={36}
        />
      </div>
      <div className="flex min-w-0 max-w-[192px] flex-col justify-center gap-1">
        <h6 className="line-clamp-2 text-xs font-medium text-gray-900">{source.name}</h6>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={source.url}
          className="truncate text-xs text-gray-500 transition-colors hover:text-gray-900"
        >
          {source.url}
        </a>
      </div>
    </div>
  )
}
