package com.kickboksapp.service;

import com.kickboksapp.entity.Member;
import com.kickboksapp.entity.TrainingLog;
import com.kickboksapp.entity.User;
import com.kickboksapp.repository.TrainingLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainingLogService {

    private final TrainingLogRepository trainingLogRepository;
    private final MemberService memberService;
    private final UserService userService;

    // En yeni kayit en ustte - uyenin roadmap'ini kronolojik gormek icin
    public List<TrainingLog> getByMember(Long memberId) {
        return trainingLogRepository.findByMemberIdOrderByLogDateDesc(memberId);
    }

    public TrainingLog create(Long memberId, Long trainerId, TrainingLog log) {
        Member member = memberService.getById(memberId);
        User trainer = userService.getById(trainerId);

        log.setMember(member);
        log.setTrainer(trainer);
        if (log.getLogDate() == null) {
            log.setLogDate(LocalDate.now());
        }

        return trainingLogRepository.save(log);
    }

    public void delete(Long id) {
        trainingLogRepository.deleteById(id);
    }
}
