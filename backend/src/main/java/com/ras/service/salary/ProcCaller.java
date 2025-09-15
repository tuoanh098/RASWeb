// backend/src/main/java/com/ras/service/salary/ProcCaller.java
package com.ras.service.salary;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.sql.CallableStatement;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class ProcCaller {
    private final JdbcTemplate jdbc;

    public void call(String procName, Object... args) {
        int n = (args == null) ? 0 : args.length;
        String placeholders = IntStream.range(0, n)
                .mapToObj(i -> "?")
                .collect(Collectors.joining(","));
        final String callSql = "{ call " + procName + "(" + placeholders + ") }";

        CallableStatementCreator csc = (con) -> {
            CallableStatement cs = con.prepareCall(callSql);
            for (int i = 0; i < n; i++) {
                cs.setObject(i + 1, args[i]);
            }
            return cs;
        };

        CallableStatementCallback<Void> action = (cs) -> {
            cs.execute();
            return null;
        };

        jdbc.execute(csc, action);
    }
}
