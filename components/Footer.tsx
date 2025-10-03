import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <div className="container flex min-h-[56px] items-center justify-between border-t border-gray-200 px-4 pb-3 pt-5 lg:min-h-[56px] lg:px-0 lg:py-5 lg:pl-5 lg:pr-5">
      <a href="https://togetherai.link/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        
        <span className="text-sm text-gray-600 tracking-tight">
          Made & powered by <span className="font-semibold">Together AI</span>
        </span>
      </a>
      <div className="flex items-center gap-3">
        <Link href={"https://x.com/nutlope"} target="_blank">
          <Image unoptimized src="/twitter.svg" alt="twitter" width={15} height={15} />
        </Link>
        <Link href={"https://github.com/Nutlope/llamatutor"} target="_blank">
          <Image unoptimized src={"/github.svg"} alt="github" width={16} height={16} />
        </Link>
      </div>
    </div>
  )
}

export default Footer
