import { useContext, useState } from 'react';
import useSWR from 'swr';
import { Box, Button, Flex, Icon } from '@chakra-ui/react';
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai';
import GeneralStatisticsChart from './GeneralStatisticsChart';
import { UserContext } from '../../Context/userContext';
import { fetchGlobalStats } from '../../services/statistics.service';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import ChannelsStatistics from './ChannelsStatistics';
import UsersStatistics from './UsersStatistics';
import OptInOutStatistics from './OptInOutStatistics';

export enum ChartType {
  LINE_CHART,
  PIE_CHART
}

export default function StatisticsPage() {
  const [currentChart, setCurrentChart] = useState(ChartType.PIE_CHART);
  const [activeSwipIndex, setActiveIndex] = useState(0);
  const { user } = useContext(UserContext);

  const { data: globalStats } = useSWR(
    `${user?.chain}/global/stat`,
    fetchGlobalStats,
    { revalidateOnFocus: false }
  );

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    }
  };

  return (
    <Box mt={5}>
      <Box width={'100%'} margin={'0 auto'} height={'550px'} css={pageCss}>
        <Swiper
          pagination={pagination}
          modules={[Pagination, Navigation]}
          loop={true}
          navigation={true}
          className="mySwiper"
          onSlideChange={({ activeIndex }) => setActiveIndex(activeIndex)}
        >
          <SwiperSlide>
            <OptInOutStatistics activeIndex={activeSwipIndex} />
          </SwiperSlide>
          <SwiperSlide>
            <GeneralStatisticsChart data={globalStats?.data || []} />
          </SwiperSlide>
          <SwiperSlide>
            <UsersStatistics activeIndex={activeSwipIndex} />
          </SwiperSlide>
          <SwiperSlide>
            <ChannelsStatistics activeIndex={activeSwipIndex} />
          </SwiperSlide>
        </Swiper>
      </Box>
      <Flex mt={5} justifyContent={'center'} display={'none'}>
        <>
          <Button
            rounded={'full'}
            display={currentChart === ChartType.LINE_CHART ? 'none' : 'flex'}
            onClick={() => setCurrentChart(ChartType.LINE_CHART)}
            size={'lg'}
            padding={'15px'}
          >
            <Icon as={AiOutlineLeftCircle} h={30} w={25} fill="blue.400" />
          </Button>
          <Button
            rounded={'full'}
            display={currentChart === ChartType.PIE_CHART ? 'none' : 'flex'}
            onClick={() => setCurrentChart(ChartType.PIE_CHART)}
            size={'lg'}
            padding={'15px'}
          >
            <Icon as={AiOutlineRightCircle} h={30} w={25} fill="blue.400" />
          </Button>
        </>
      </Flex>
    </Box>
  );
}

const pageCss = `
.swiper-pagination {
  text-align: center;
}
.swiper-pagination-bullet {
  width: 20px;
  height: 20PX;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #000;
  opacity: 1;
  background: gray;
  padding: 10px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right:10px;
  cursor:pointer;
}
.swiper-pagination-bullet-active {
  color: #fff;
  background: #007aff;
}
@media (max-width: 48rem) {
  .swiper-button-next,
  .swiper-button-prev {
    display: none;
  }
}
`;
