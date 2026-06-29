import logoAsset from "@/assets/talentbd-logo.png.asset.json";
const logo = logoAsset.url;

export function BrandMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logo}
      alt="TalentBD"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
