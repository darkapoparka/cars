import Image from "./public-image";
import styles from "./desktop-banner-cars.module.css";

const pairs = {
  inventory: ["golf", "a45"],
  landing: ["gclass", "urus"],
  page: ["m4", "rs5"],
} as const;

export function DesktopBannerCars({
  variant,
}: {
  variant: keyof typeof pairs;
}) {
  return (
    <div aria-hidden="true" className={styles.cars} data-variant={variant}>
      {pairs[variant].map((car, index) => (
        <div className={index === 0 ? styles.left : styles.right} key={car}>
          <Image
            alt=""
            src={`/images/desktop/cutout-${car}-v1.webp`}
            width={1000}
            height={667}
            sizes="(min-width: 1024px) 28rem, 0px"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
