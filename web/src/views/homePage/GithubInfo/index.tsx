import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Typography, Spin, message } from 'antd';
import { GithubOutlined, StarOutlined, ForkOutlined, EyeOutlined } from '@ant-design/icons';
import { GITHUB_CONFIG } from '@/config/github';

const { Title } = Typography;

interface GithubStats {
  totalStars: number;
  totalForks: number;
  totalViews: number;
  totalCommits: number;
}

interface Commit {
  sha: string;
  message: string;
  date: string;
  repo: string;
}

interface Repository {
  name: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
}

const GithubInfo: React.FC = () => {
  const [stats, setStats] = useState<GithubStats>({
    totalStars: 0,
    totalForks: 0,
    totalViews: 0,
    totalCommits: 0
  });
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        // 获取用户的所有仓库
        const reposResponse = await fetch(
          `${GITHUB_CONFIG.baseUrl}/users/${GITHUB_CONFIG.username}/repos`,
          {
            headers: {
              Authorization: `token ${GITHUB_CONFIG.token}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );
        console.log(`${GITHUB_CONFIG.baseUrl}/users/${GITHUB_CONFIG.username}/repos`,);
        console.log( `token ${GITHUB_CONFIG.token}`,)
        if (!reposResponse.ok) {
          throw new Error('获取仓库信息失败');
        }

        const repos: Repository[] = await reposResponse.json();

        // 计算总星标数、复刻数和访问量
        const totalStats = repos.reduce(
          (acc, repo) => ({
            totalStars: acc.totalStars + repo.stargazers_count,
            totalForks: acc.totalForks + repo.forks_count,
            totalViews: acc.totalViews + repo.watchers_count,
            totalCommits: acc.totalCommits,
          }),
          { totalStars: 0, totalForks: 0, totalViews: 0, totalCommits: 0 }
        );

        // 获取最近的提交记录
        const commitsPromises = repos.slice(0, 5).map(async (repo) => {
          const commitsResponse = await fetch(
            `${GITHUB_CONFIG.baseUrl}/repos/${GITHUB_CONFIG.username}/${repo.name}/commits`,
            {
              headers: {
                Authorization: `token ${GITHUB_CONFIG.token}`,
                Accept: 'application/vnd.github.v3+json',
              },
            }
          );

          if (!commitsResponse.ok) {
            return [];
          }

          const repoCommits = await commitsResponse.json();
          return repoCommits.slice(0, 3).map((commit: any) => ({
            sha: commit.sha,
            message: commit.commit.message,
            date: new Date(commit.commit.author.date).toLocaleDateString(),
            repo: repo.name,
          }));
        });

        const allCommits = await Promise.all(commitsPromises);
        const flattenedCommits = allCommits.flat().sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // 更新状态
        setStats({
          ...totalStats,
          totalCommits: flattenedCommits.length,
        });
        setCommits(flattenedCommits.slice(0, 10));
      } catch (error) {
        console.error('获取GitHub数据失败:', error);
        message.error('获取GitHub数据失败，请检查配置');
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 h-[400px] overflow-y-auto bg-[var(--bg-color)]">
      <Title level={2} className="mb-6 text-[var(--text-color)]">
        <GithubOutlined /> GitHub 统计
      </Title>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="bg-[var(--card-bg-color)] border-[var(--border-color)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <Statistic
              title="总星标数"
              value={stats.totalStars}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="bg-[var(--card-bg-color)] border-[var(--border-color)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <Statistic
              title="总复刻数"
              value={stats.totalForks}
              prefix={<ForkOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="bg-[var(--card-bg-color)] border-[var(--border-color)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <Statistic
              title="总访问量"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="bg-[var(--card-bg-color)] border-[var(--border-color)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <Statistic
              title="总提交数"
              value={stats.totalCommits}
              prefix={<GithubOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Title level={3}>最近提交</Title>
      <List
        dataSource={commits}
        renderItem={(commit) => (
          <List.Item>
            <Card className="w-full bg-[var(--card-bg-color)] border-[var(--border-color)]">
              <Typography.Text strong>{commit.message}</Typography.Text>
              <br />
              <Typography.Text type="secondary">
                仓库: {commit.repo} | 提交: {commit.sha.substring(0, 7)} | 日期: {commit.date}
              </Typography.Text>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default GithubInfo; 
