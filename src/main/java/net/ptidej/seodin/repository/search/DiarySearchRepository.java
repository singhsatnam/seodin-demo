package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.Diary;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Diary entity.
 */
public interface DiarySearchRepository extends ElasticsearchRepository<Diary, Long> {
}
