// components/SkeletonLoader.js
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader = ({ count }) => {
  return (
    <div>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="mb-4">
          <Skeleton height={200} />
          <Skeleton height={30} width="80%" />
          <Skeleton height={20} width="60%" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
